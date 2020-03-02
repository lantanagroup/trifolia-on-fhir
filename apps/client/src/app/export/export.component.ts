import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { ImplementationGuideService } from '../shared/implementation-guide.service';
import { saveAs } from 'file-saver';
import { ExportOptions, ExportService } from '../shared/export.service';
import { ExportFormats } from '../models/export-formats.enum';
import { SocketService } from '../shared/socket.service';
import { Globals } from '../../../../../libs/tof-lib/src/lib/globals';
import { CookieService } from 'angular2-cookie/core';
import { ConfigService } from '../shared/config.service';
import { Bundle, DomainResource, ImplementationGuide } from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import { FileModel, GithubService } from '../shared/github.service';
import { FhirService } from '../shared/fhir.service';
import { Observable } from 'rxjs';
import { ExportGithubPanelComponent } from '../export-github-panel/export-github-panel.component';
import { debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { AuthService } from '../shared/auth.service';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { getErrorString, getStringFromBlob } from '../../../../../libs/tof-lib/src/lib/helper';
import { HttpClient } from '@angular/common/http';

@Component({
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.css']
})
export class ExportComponent implements OnInit {
  public message: string;
  public socketOutput = '';
  public githubResourcesBundle: Bundle;
  public githubCommitMessage: string;
  public searching = false;
  public activeTabId = 'html';
  public Globals = Globals;
  public templateVersions: string[] = [];
  public templateChanged = new EventEmitter();

  @ViewChild('githubPanel', { static: true }) githubPanel: ExportGithubPanelComponent;

  public options = new ExportOptions();
  public selectedImplementationGuide: ImplementationGuide;

  constructor(
    private authService: AuthService,
    private implementationGuideService: ImplementationGuideService,
    private socketService: SocketService,
    private exportService: ExportService,
    private cookieService: CookieService,
    private githubService: GithubService,
    private fhirService: FhirService,
    public configService: ConfigService,
    public http: HttpClient) {

    this.options.implementationGuideId = this.cookieService.get(Globals.cookieKeys.exportLastImplementationGuideId + '_' + this.configService.fhirServer);
    this.options.responseFormat = <any>this.cookieService.get(Globals.cookieKeys.lastResponseFormat) || 'application/json';
    this.options.downloadOutput = true;
    this.options.template = <any>this.cookieService.get(Globals.cookieKeys.lastExportTemplate) || this.options.template;
    this.options.templateVersion = <any>this.cookieService.get(Globals.cookieKeys.lastExportTemplateVersion) || this.options.templateVersion;

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

  private async getImplementationGuideResources() {
    this.message = 'Retrieving resources for the implementation guide';

    const bundleResponse = await this.exportService.exportBundle(<ExportOptions>{implementationGuideId: this.options.implementationGuideId, exportFormat: ExportFormats.Bundle,
      downloadOutput: false}).toPromise();
    const bundleJson = await getStringFromBlob(bundleResponse.body);

    try {
      this.githubResourcesBundle = <Bundle>JSON.parse(bundleJson);
      this.message = '';
    } catch (ex) {
      this.message = 'Could not parse the bundle: ' + ex.message;
    }
  }

  public onTabChange(event: NgbTabChangeEvent) {
    this.activeTabId = event.nextId;

    switch (this.activeTabId) {
      case 'html':
        this.options.exportFormat = ExportFormats.HTML;
        break;
      case 'bundle':
        this.options.exportFormat = ExportFormats.Bundle;
        break;
      case 'msword':
        this.options.exportFormat = ExportFormats.MSWORD;
        break;
      case 'github':
        this.options.exportFormat = ExportFormats.GitHub;
        // noinspection JSIgnoredPromiseFromCall
        this.getImplementationGuideResources();
        break;
      default:
        throw new Error('Unexpected tab selected. Cannot set export format.');
    }
  }

  public implementationGuideChanged(implementationGuide: ImplementationGuide) {
    this.selectedImplementationGuide = implementationGuide;
    this.options.implementationGuideId = implementationGuide ? implementationGuide.id : undefined;
    this.githubResourcesBundle = null;
    this.githubCommitMessage = null;

    const cookieKey = Globals.cookieKeys.exportLastImplementationGuideId + '_' + this.configService.fhirServer;

    if (implementationGuide && implementationGuide.id) {
      this.cookieService.put(cookieKey, implementationGuide.id);

      if (this.options.exportFormat === ExportFormats.GitHub) {
        // noinspection JSIgnoredPromiseFromCall
        this.getImplementationGuideResources();
      }
    } else if (this.cookieService.get(cookieKey)) {
      this.cookieService.remove(cookieKey);
    }
  }

  public searchImplementationGuide = (text$: Observable<string>) => {
    return text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      switchMap((term) => {
        return this.implementationGuideService.getImplementationGuides(1, term).pipe(
          map((bundle) => {
            return (bundle.entry || []).map((entry) => <ImplementationGuide> entry.resource);
          })
        );
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

  public templateHasChanged() {
    this.cookieService.put(Globals.cookieKeys.lastExportTemplate, this.options.template);
    this.templateChanged.emit();
  }

  public responseFormatChanged() {
    this.cookieService.put(Globals.cookieKeys.lastResponseFormat, this.options.responseFormat);
  }

  public get exportDisabled(): boolean {
    if (!this.options.implementationGuideId || !this.options.exportFormat) {
      return true;
    }

    if (this.options.exportFormat === ExportFormats.GitHub) {
      if (!this.githubService.token || !this.githubResourcesBundle || !this.githubResourcesBundle.entry) {
        return true;
      }

      const filtered = (this.githubResourcesBundle.entry || []).filter((entry) => {
        return this.fhirService.getResourceGithubDetails(entry.resource).hasAllDetails();
      });

      return !!(filtered.length === 0 || !this.githubCommitMessage);
    }

    return !this.options.responseFormat;
  }

  private exportGithub() {
    const implementationGuide = (this.githubResourcesBundle.entry || []).find((entry) => entry.resource.resourceType === 'ImplementationGuide').resource;
    const implementationGuideDetails = this.fhirService.getResourceGithubDetails(implementationGuide);

    const queue = <DomainResource[]> (this.githubResourcesBundle.entry || [])
      .filter((entry) => {
        const details = this.fhirService.getResourceGithubDetails(entry.resource);
        return !!(details.owner && details.repository && details.branch && details.path);
      })
      .filter((entry) => {
        return !!this.githubPanel.checkedIds.find((id) => id === entry.resource.id);
      })
      .map((entry) => entry.resource);

    const files = queue.map((resource) => {
      const details = this.fhirService.getResourceGithubDetails(resource);
      const content = details.path.endsWith('.xml') ? this.fhirService.serialize(resource) : JSON.stringify(resource, null, '\t');

      return <FileModel>{
        path: details.path,
        content: content
      };
    });

    this.githubService.updateContents(implementationGuideDetails.owner, implementationGuideDetails.repository, this.githubCommitMessage, files, implementationGuideDetails.branch)
      .subscribe(() => {
        this.message = 'Done exporting to GitHub';
      }, (err) => {
        this.message = getErrorString(err);
      });
  }

  public export() {
    this.socketOutput = '';
    this.message = 'Exporting...';

    this.cookieService.put(Globals.cookieKeys.exportLastImplementationGuideId + '_' + this.configService.fhirServer, this.options.implementationGuideId);

    const igName = this.selectedImplementationGuide.name.replace(/\s/g, '_');

    const extension = this.options.responseFormat === 'application/xml' ? '.xml' : this.options.responseFormat === 'application/msword' ? '.docx' : '.json';


    try {
      switch (this.options.exportFormat) {
        case ExportFormats.HTML:
          //Need to discuss the difference between HTML vs Bundle
          this.exportService.exportHtml(this.options)
              .subscribe((response) => {
                saveAs(response.body, igName + '.zip');
                this.message = 'Done exporting.';
              }, (err) => {
                this.message = getErrorString(err);
              });
          break;
        case ExportFormats.Bundle:
          this.exportService.exportBundle(this.options)
            .subscribe((response) => {
              saveAs(response.body, igName + extension);
              this.message = 'Done exporting.';
            }, (err) => {
              this.message = getErrorString(err);
            });
          break;
        case ExportFormats.MSWORD:
            this.exportService.exportMsWord(this.options)
              .subscribe((response) => {
                saveAs(response.body, igName + extension);
                this.message = 'Done exporting.';
              }, (err) => {
                this.message = getErrorString(err);
              });
            break;
        case ExportFormats.GitHub:
          this.exportGithub();
          break;
      }
    } catch (ex) {
      this.message = ex.message;
    }
  }

  ngOnInit() {
    if (this.configService.project) {
      this.options.implementationGuideId = this.configService.project.implementationGuideId;
    }

    this.templateChanged.emit();

    if (this.options.implementationGuideId) {
      this.implementationGuideService.getImplementationGuide(this.options.implementationGuideId)
        .subscribe((implementationGuide: ImplementationGuide) => {
          this.selectedImplementationGuide = implementationGuide;
        }, (err) => this.message = getErrorString(err));
    }
  }
}
