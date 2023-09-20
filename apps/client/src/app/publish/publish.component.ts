import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { ExportOptions, ExportService } from '../shared/export.service';
import { getErrorString, Globals, IImplementationGuide, SearchImplementationGuideResponseContainer } from '@trifolia-fhir/tof-lib';
import { ConfigService } from '../shared/config.service';
import { CookieService } from 'ngx-cookie-service';
import { ImplementationGuideService } from '../shared/implementation-guide.service';
import { FhirService } from '../shared/fhir.service';
import { HtmlExportStatus, SocketService } from '../shared/socket.service';
import { saveAs } from 'file-saver';
import { NgbNav } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { IFhirResource } from '@trifolia-fhir/models';

@Component({
  selector: 'ngbd-typeahead-basic',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.css']
})
export class PublishComponent implements OnInit {
  public selectedImplementationGuide: IImplementationGuide;
  public options = new ExportOptions();
  public searching = false;
  public message: string;
  public socketOutput = '';
  public autoScroll = true;
  public Globals = Globals;
  public inProgress = false;
  public templateVersions: string[] = [];
  private packageId;

  @ViewChild('tabs', { static: true })
  private tabs: NgbNav;

  @ViewChild('outputEle')
  private outputEle: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private socketService: SocketService,
    private fhirService: FhirService,
    private implementationGuideService: ImplementationGuideService,
    private cookieService: CookieService,
    public configService: ConfigService,
    private exportService: ExportService) {

    this.options.implementationGuideId = !this.route.snapshot.paramMap.get('id') ?
      this.cookieService.get(Globals.cookieKeys.exportLastImplementationGuideId + '_' + this.configService.fhirVersion) :
      this.route.snapshot.paramMap.get('id');
    this.options.responseFormat = <any>this.cookieService.get(Globals.cookieKeys.lastResponseFormat) || 'application/json';
    this.options.templateType = <any>this.cookieService.get(Globals.cookieKeys.lastTemplateType) || this.options.templateType;
    this.options.template = <any>this.cookieService.get(Globals.cookieKeys.lastTemplate) || this.options.template;
    this.options.templateVersion = <any>this.cookieService.get(Globals.cookieKeys.lastTemplateVersion) || this.options.templateVersion;
    // Handle intermittent disconnects mid-export by notifying the server that we are currently exporting the given packageId
    this.socketService.onConnected.subscribe(() => {
      if (this.packageId) {
        this.socketService.notifyExporting(this.packageId);
      }
    });
  }

  public async implementationGuideChanged(implementationGuide: IImplementationGuide) {
    this.selectedImplementationGuide = implementationGuide;

    const cookieKey = Globals.cookieKeys.exportLastImplementationGuideId + '_' + this.configService.fhirVersion;

    if (this.options.implementationGuideId) {
      this.cookieService.set(cookieKey, this.options.implementationGuideId);
    } else if (this.cookieService.get(cookieKey)) {
    } else if (this.cookieService.get(cookieKey)) {
      this.cookieService.delete(cookieKey);
    }

    const pubTemplateExt = (implementationGuide.extension || []).find(e => e.url === Globals.extensionUrls['extension-ig-pub-template']);

    if (pubTemplateExt) {
      if (pubTemplateExt.valueUri) {
        this.options.templateType = 'custom-uri';
        this.options.template = pubTemplateExt.valueUri;
      } else if (pubTemplateExt.valueString) {
        this.options.templateType = 'official';

        if (pubTemplateExt.valueString.indexOf('#') >= 0) {
          this.options.template = pubTemplateExt.valueString.substring(0, pubTemplateExt.valueString.indexOf('#'));
          this.options.templateVersion = pubTemplateExt.valueString.substring(pubTemplateExt.valueString.indexOf('#') + 1);
        } else {
          this.options.template = pubTemplateExt.valueString;
          this.options.templateVersion = 'current';
        }

        this.templateVersions = await this.configService.getTemplateVersions(this.options.template);
      }
    }
  }

  public searchImplementationGuide = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      switchMap((term: string) => {
        return this.implementationGuideService.getImplementationGuides(1, term)
          .pipe(map((bundle: SearchImplementationGuideResponseContainer) => {
            return (bundle.responses || []).map((entry) => <IImplementationGuide>entry.data.resource);
          }));
      }),
      tap(() => this.searching = false)
    );
  };

  public searchFormatter = (ig: IImplementationGuide) => {
    return `${ig.name} (id: ${ig.id})`;
  };

  public clearImplementationGuide() {
    const cookieKey = Globals.cookieKeys.exportLastImplementationGuideId + '_' + this.configService.fhirVersion;

    this.selectedImplementationGuide =
      this.options.implementationGuideId = null;

    if (this.cookieService.get(cookieKey)) {
      this.cookieService.delete(cookieKey);
    }
  }

  public get publishDisabled(): boolean {
    return !this.options.implementationGuideId || !this.options.responseFormat || this.inProgress || !this.options.version;
  }

  public responseFormatChanged() {
    this.cookieService.set(Globals.cookieKeys.lastResponseFormat, this.options.responseFormat);
  }

  public async templateTypeChanged() {
    if (this.options.templateType === 'official') {
      this.options.template = 'hl7.fhir.template';
      this.options.templateVersion = 'current';
    } else if (this.options.templateType === 'custom-uri') {
      this.options.template = '';
    }

    this.cookieService.set(Globals.cookieKeys.lastTemplateType, this.options.templateType);
    await this.templateChanged();
  }

  public async templateChanged() {
    this.cookieService.set(Globals.cookieKeys.lastTemplate, this.options.template);

    if (this.options.templateType === 'official') {
      this.templateVersions = await this.configService.getTemplateVersions(this.options.template);

      if (this.templateVersions && this.options.templateVersion && this.templateVersions.indexOf(this.options.templateVersion) < 0) {
        this.templateVersions.push(this.options.templateVersion);
      } else if (this.templateVersions && this.templateVersions.length > 0) {
        this.options.templateVersion = this.templateVersions[0];
      } else {
        this.options.templateVersion = 'current';
      }
    } else {
      this.options.templateVersion = null;
    }

    this.templateVersionChanged();
  }

  public templateVersionChanged() {
    if (!this.options.templateVersion) {
      if (this.cookieService.get(Globals.cookieKeys.lastTemplateVersion)) {
        this.cookieService.delete(Globals.cookieKeys.lastTemplateVersion);
      }
    } else {
      this.cookieService.set(Globals.cookieKeys.lastTemplateVersion, this.options.templateVersion);
    }
  }

  public async publish() {
    this.message = '';
    this.inProgress = true;
    this.socketOutput = '';
    this.tabs.select('status');

    try {
      this.packageId = await firstValueFrom(this.exportService.publish(this.options));
    } catch (ex) {
      this.message = getErrorString(ex);
      this.inProgress = false;
    }
  }

  public cancel() {
    this.tabs.select('status');

    this.exportService.cancel(this.packageId)
      .subscribe((packageId: string) => {
        this.packageId = packageId;
        this.inProgress = false;
      }, (err) => {
        this.message = getErrorString(err);
      });
  }

  public get igSpecifiesTemplate() {
    if (!this.selectedImplementationGuide || !this.selectedImplementationGuide.extension) return false;
    return !!(this.selectedImplementationGuide.extension || []).find(e => e.url === 'https://trifolia-fhir.lantanagroup.com/StructureDefinition/extension-ig-pub-template');
  }

  public getPackageId() {
    return this.packageId;
  }

  async ngOnInit() {
    if (this.configService.igContext) {
      this.options.implementationGuideId = this.configService.igContext.implementationGuideId;
    }

    if (this.options.implementationGuideId) {
      this.implementationGuideService.getImplementationGuide(this.options.implementationGuideId)
        .subscribe({
          next: (conf: IFhirResource) => { this.implementationGuideChanged(<IImplementationGuide>conf?.resource); },
          error: (err) => this.message = getErrorString(err)
        });
    }

    await this.templateChanged();

    this.socketService.onHtmlExport.subscribe((data: HtmlExportStatus) => {
      if (data.packageId === this.packageId) {
        if (data.status === 'complete') {
          this.message = 'Done exporting';

          this.socketOutput += data.message;

          if (this.options.downloadOutput) {
            const igName = this.selectedImplementationGuide.name.replace(/\s/g, '_');

            this.exportService.getPackage(this.packageId)
              .subscribe((results: any) => {
                saveAs(results.body, igName + '.zip');
              });
          }

          this.inProgress = false;
          if (this.autoScroll && this.outputEle) {
            setTimeout(() => this.outputEle.nativeElement.scrollTop = this.outputEle.nativeElement.scrollHeight, 50);
          }
        } else if (data.status === 'error') {
          this.inProgress = false;
          this.message = 'An error occurred. Please review the status tab.';
        } else {
          let msg = data.message ? data.message.trim() : "";

          if (msg && !msg.endsWith('\n')) {
            msg += '\r\n';
          }

          this.socketOutput += msg;
          if (this.autoScroll && this.outputEle) {
            setTimeout(() => this.outputEle.nativeElement.scrollTop = this.outputEle.nativeElement.scrollHeight, 50);
          }

        }
      }
    }, (err) => {
      this.socketOutput += 'An error occurred while communicating with the server for the export: ' + getErrorString(err);
    });
  }
}
