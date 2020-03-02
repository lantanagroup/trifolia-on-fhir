import { Component, ElementRef, EventEmitter, OnInit, ViewChild } from '@angular/core';
import {ImplementationGuide} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {Observable} from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import {ExportOptions, ExportService} from '../shared/export.service';
import {Globals} from '../../../../../libs/tof-lib/src/lib/globals';
import {ConfigService} from '../shared/config.service';
import {CookieService} from 'angular2-cookie/core';
import {ImplementationGuideService} from '../shared/implementation-guide.service';
import {FhirService} from '../shared/fhir.service';
import {HtmlExportStatus, SocketService} from '../shared/socket.service';
import {saveAs} from 'file-saver';
import {ServerValidationResult} from '../../../../../libs/tof-lib/src/lib/server-validation-result';
import {NgbTabset} from '@ng-bootstrap/ng-bootstrap';
import {ActivatedRoute} from '@angular/router';
import {getErrorString} from '../../../../../libs/tof-lib/src/lib/helper';
import { HttpClient } from '@angular/common/http';
import { error } from 'util';

@Component({
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.css']
})
export class PublishComponent implements OnInit {
  public selectedImplementationGuide: ImplementationGuide;
  public options = new ExportOptions();
  public searching = false;
  public message: string;
  public validation: ServerValidationResult[];
  public socketOutput = '';
  public autoScroll = true;
  public Globals = Globals;
  public inProgress = false;
  public templateChanged = new EventEmitter();
  public templateVersions : string[] = [];

  private packageId;

  @ViewChild('tabs', { static: true })
  private tabs: NgbTabset;

  @ViewChild('outputEle', { static: false })
  private outputEle: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private socketService: SocketService,
    private fhirService: FhirService,
    private implementationGuideService: ImplementationGuideService,
    private cookieService: CookieService,
    public configService: ConfigService,
    private exportService: ExportService,
    private http: HttpClient) {

    this.options.implementationGuideId = !this.route.snapshot.paramMap.get('id') ?
      this.cookieService.get(Globals.cookieKeys.exportLastImplementationGuideId + '_' + this.configService.fhirServer) :
      this.route.snapshot.paramMap.get('id');
    this.options.responseFormat = <any>this.cookieService.get(Globals.cookieKeys.lastResponseFormat) || 'application/json';
    this.options.template = <any>this.cookieService.get(Globals.cookieKeys.lastTemplate) || this.options.template;
    this.options.templateVersion = <any>this.cookieService.get(Globals.cookieKeys.lastTemplateVersion) || this.options.templateVersion;
    // Handle intermittent disconnects mid-export by notifying the server that we are currently exporting the given packageId
    this.socketService.onConnected.subscribe(() => {
      if (this.packageId) {
        this.socketService.notifyExporting(this.packageId);
      }
    });

    this.templateChanged
      .subscribe(async () => {
        let url = '';
        this.templateVersions = [];
        if(this.options.template === 'hl7.fhir.template'){
          url = 'https://raw.githubusercontent.com/HL7/ig-template-fhir/master/package-list.json';
        }
        else if(this.options.template === 'hl7.cda.template'){
          url = 'https://raw.githubusercontent.com/HL7/ig-template-cda/master/package-list.json';
        }

        try{
          const versionJSON = await this.http.get(url).toPromise();
          if(versionJSON.hasOwnProperty('list') && versionJSON['list']){
            for(let x = 0; x < versionJSON['list'].length; x++){
              if(versionJSON['list'][x]['version']) this.templateVersions.push(versionJSON['list'][x]['version']);
            }
          }
        }catch(ex){
          this.templateVersions = ['current'];
          this.message = "Error getting version list: " + getErrorString(ex);
        }
      }, (err) => {
        this.message = "Error populating version numbers: " + getErrorString(err);
      });
  }

  public implementationGuideChanged(implementationGuide: ImplementationGuide) {
    this.selectedImplementationGuide = implementationGuide;
    this.options.implementationGuideId = implementationGuide ? implementationGuide.id : undefined;
    this.validation = null;

    const cookieKey = Globals.cookieKeys.exportLastImplementationGuideId + '_' + this.configService.fhirServer;

    if (implementationGuide && implementationGuide.id) {
      this.cookieService.put(cookieKey, implementationGuide.id);
    } else if (this.cookieService.get(cookieKey)) {
      this.cookieService.remove(cookieKey);
    }

    if (implementationGuide && implementationGuide.id) {
      this.exportService.validate(implementationGuide.id)
        .subscribe(
          (results) => {
            this.validation = results;
          },
          (err) => this.message = getErrorString(err)
        );
    }
  }

  public searchImplementationGuide = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      switchMap((term) => {
        return this.implementationGuideService.getImplementationGuides(1, term).pipe(map((bundle) => {
          return (bundle.entry || []).map((entry) => <ImplementationGuide>entry.resource);
        }));
      }),
      tap(() => this.searching = false)
    );
  };

  public searchFormatter = (ig: ImplementationGuide) => {
    return `${ig.name} (id: ${ig.id})`;
  };

  public clearImplementationGuide() {
    const cookieKey = Globals.cookieKeys.exportLastImplementationGuideId + '_' + this.configService.fhirServer;

    this.selectedImplementationGuide =
      this.options.implementationGuideId = null;

    if (this.cookieService.get(cookieKey)) {
      this.cookieService.remove(cookieKey);
    }
  }

  public get publishDisabled(): boolean {
    return !this.options.implementationGuideId || !this.options.responseFormat || this.inProgress;
  }

  public responseFormatChanged() {
    this.cookieService.put(Globals.cookieKeys.lastResponseFormat, this.options.responseFormat);
  }

  public templateHasChanged() {
    this.cookieService.put(Globals.cookieKeys.lastTemplate, this.options.template);
    this.templateChanged.emit();
  }

  public publish() {
    this.inProgress = true;
    this.socketOutput = '';
    this.tabs.select('status');

    this.exportService.publish(this.options)
      .subscribe((packageId: string) => {
        this.packageId = packageId;
      }, (err) => {
        this.message = getErrorString(err);
        this.inProgress = false;
      });
  }

  public cancel(){
    this.tabs.select('status');

    this.exportService.cancel(this.packageId)
      .subscribe((packageId: string) => {
        this.packageId = packageId;
        this.inProgress = false;
      }, (err) => {
        this.message = getErrorString(err);
    });
  }

  public getPackageId(){
    return this.packageId;
  }

  public ngOnInit() {
    if (this.configService.project) {
      this.options.implementationGuideId = this.configService.project.implementationGuideId;
    }

    if (this.options.implementationGuideId) {
      this.implementationGuideService.getImplementationGuide(this.options.implementationGuideId)
        .subscribe((implementationGuide: ImplementationGuide) => {
          this.implementationGuideChanged(implementationGuide);
        }, (err) => this.message = getErrorString(err));
    }

    this.templateChanged.emit();

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
                this.inProgress = false;
              });
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
