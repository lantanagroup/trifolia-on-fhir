import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Observable, firstValueFrom} from 'rxjs';
import {debounceTime, distinctUntilChanged, map, switchMap, tap} from 'rxjs/operators';
import {ExportOptions, ExportService} from '../shared/export.service';
import {getErrorString, Globals, IImplementationGuide, SearchImplementationGuideResponseContainer} from '@trifolia-fhir/tof-lib';
import {ConfigService} from '../shared/config.service';
import {CookieService} from 'ngx-cookie-service';
import {ImplementationGuideService} from '../shared/implementation-guide.service';
import {FhirService} from '../shared/fhir.service';
import {HtmlExportStatus, SocketService} from '../shared/socket.service';
import {saveAs} from 'file-saver';
import {NgbNav} from '@ng-bootstrap/ng-bootstrap';
import {ActivatedRoute} from '@angular/router';
import {IFhirResource, Template} from '@trifolia-fhir/models';
import {NonFhirResourceService} from '../shared/non-fhir-resource.service';

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
  private template;
  private fhirResource;

  @ViewChild('tabs', { static: true })
  private tabs: NgbNav;

  @ViewChild('outputEle')
  private outputEle: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private socketService: SocketService,
    private fhirService: FhirService,
    private implementationGuideService: ImplementationGuideService,
    private nonFhirResourceService: NonFhirResourceService,
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

    // get the template
    if (!this.template) {
      let template = new Template();
      let res = await firstValueFrom(this.nonFhirResourceService.getByType(template, this.options.implementationGuideId));
      if (res.id) {
        this.template = res;
      } else {
        this.template = template;
        this.template.templateType = <any>this.cookieService.get(Globals.cookieKeys.lastTemplateType) || this.options.templateType;
        if (this.template.templateType && this.template.templateType == 'official') {
          this.template.content = <any>this.cookieService.get(Globals.cookieKeys.lastTemplate) || this.options.template + '#' + <any>this.cookieService.get(Globals.cookieKeys.lastTemplateVersion) || this.options.templateVersion;
        } else {
          this.template.content = <any>this.cookieService.get(Globals.cookieKeys.lastTemplate) || this.options.template;
        }
      }
    }

    this.options.templateType = this.template.templateType;
    if (this.template.templateType && this.template.templateType == 'custom-uri') {
      this.options.template = this.template.content;
    } else if (this.template.templateType && this.template.templateType == 'custom-template') {
      this.options.template = this.template.content;
    } else if (this.template.templateType && this.template.templateType == 'official') {
      let content = this.template.content;
      const hashTagIndex = (content || '').indexOf('#');
      if (typeof content === 'string' && hashTagIndex >= 0) {
        this.options.template = content.substring(0, hashTagIndex);
        this.options.templateVersion = content.substring(hashTagIndex + 1);
      } else {
        this.options.template = content;
        this.options.templateVersion = 'current';
      }

      this.templateVersions = await this.configService.getTemplateVersions(this.options.template);
      if (this.options.templateVersion  &&  this.templateVersions.indexOf(this.options.templateVersion) < 0) {
        this.options.templateVersion = this.templateVersions[0];
      } else if (!this.options.templateVersion && this.templateVersions && this.templateVersions.length > 0) {
        this.options.templateVersion = this.templateVersions[0];
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
    return !this.options.implementationGuideId || !this.options.responseFormat || this.inProgress || !this.options.version || this.isTemplateNotSetup();
  }

  public responseFormatChanged() {
    this.cookieService.set(Globals.cookieKeys.lastResponseFormat, this.options.responseFormat);
  }


  isTemplateNotSetup(){
    if (this.options.templateType === 'custom-uri' && !this.options.template) {
      return true;
    } else if (this.options.templateType === 'official' && (!this.options.template || !this.options.templateVersion)) {
      return true;
    } else if (this.options.templateType === 'custom-template' && !this.options.template) {
      return true;
    }
  }

  public async templateChanged() {
    if (this.template.templateType) {
      this.options.templateType = this.template.templateType;
      this.cookieService.set(Globals.cookieKeys.lastTemplateType, this.options.templateType);
    }
    this.options.template = this.template.content;
    if (this.template.templateType == 'official') {
      this.options.template = this.template.content.substring(0, this.template.content.indexOf('#'));
      this.options.templateVersion = this.template.content.substring(this.template.content.indexOf('#') + 1);
    } else if (this.template.templateType == 'custom-uri' || this.template.templateType == 'custom-template') {
      this.options.templateVersion = null;
    }
    this.cookieService.set(Globals.cookieKeys.lastTemplate, this.options.template);
    this.cookieService.set(Globals.cookieKeys.lastTemplateVersion, this.options.templateVersion);
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
    if (!this.selectedImplementationGuide) return false;
    return (this.template && this.template['id']);
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
          next: (conf: IFhirResource) => {
            this.fhirResource = conf;
            this.implementationGuideChanged(<IImplementationGuide>conf?.resource);
            this.cookieService.set(Globals.cookieKeys.lastTemplate, this.options.template);
          },
          error: (err) => this.message = getErrorString(err)
        });
    }


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
          let msg = data.message ? data.message.trim() : '';

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
