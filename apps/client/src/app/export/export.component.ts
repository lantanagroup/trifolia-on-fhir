import {Component, OnInit, ViewChild} from '@angular/core';
import {ImplementationGuideService} from '../shared/implementation-guide.service';
import {saveAs} from 'file-saver';
import {ExportOptions, ExportService} from '../shared/export.service';
import {ExportFormats} from '../models/export-formats.enum';
import {CookieService} from 'ngx-cookie-service';
import {ConfigService} from '../shared/config.service';
import {ImplementationGuide} from '@trifolia-fhir/stu3';
import {Observable} from 'rxjs';
import {ExportGithubPanelComponent} from '../export-github-panel/export-github-panel.component';
import {debounceTime, distinctUntilChanged, map, switchMap, tap} from 'rxjs/operators';
import {NgbNavChangeEvent} from '@ng-bootstrap/ng-bootstrap';
import {getErrorString, Globals, SearchImplementationGuideResponseContainer} from '@trifolia-fhir/tof-lib';
import {HttpClient} from '@angular/common/http';
import {IFhirResource} from '@trifolia-fhir/models';
import {FhirService} from '../shared/fhir.service';

interface DocumentOptions {
  compositionId?: string;
  format: string;
}

@Component({
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.css']
})
export class ExportComponent implements OnInit {
  public message: string;
  public socketOutput = '';
  public searching = false;
  public activeTabId = 'html';
  public Globals = Globals;
  public templateVersions: string[] = [];

  @ViewChild('githubPanel') githubPanel: ExportGithubPanelComponent;

  public options = new ExportOptions();
  public selectedImplementationGuide: ImplementationGuide;
  public documentOptions: DocumentOptions = {
    format: 'application/json'
  };
  public compositions: {
    id: string,
    name: string
  }[] = [];

  constructor(
    private implementationGuideService: ImplementationGuideService,
    private fhirService: FhirService,
    private exportService: ExportService,
    private cookieService: CookieService,
    public configService: ConfigService,
    public http: HttpClient) {

    this.options.implementationGuideId = this.cookieService.get(Globals.cookieKeys.exportLastImplementationGuideId + '_' + this.configService.fhirVersion);
    this.options.responseFormat = <any>this.cookieService.get(Globals.cookieKeys.lastResponseFormat) || 'application/xml';
    this.options.downloadOutput = true;
    this.options.templateType = <any>this.cookieService.get(Globals.cookieKeys.lastTemplateType) || this.options.templateType;
    this.options.template = <any>this.cookieService.get(Globals.cookieKeys.lastTemplate) || this.options.template;
    this.options.templateVersion = <any>this.cookieService.get(Globals.cookieKeys.lastTemplateVersion) || this.options.templateVersion;
  }

  public getSelectedComposition() {
    const found = this.compositions.find(c => c.id === this.documentOptions.compositionId);
    if (!found) {
      return 'Select';
    } else if (found.name) {
      return found.name;
    }
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

      const templateVersionCookie = <any>this.cookieService.get(Globals.cookieKeys.lastTemplateVersion);
      if (this.templateVersions && this.templateVersions.indexOf(templateVersionCookie) >= 0) {
        this.options.templateVersion = templateVersionCookie;
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

  public onTabChange(event: NgbNavChangeEvent) {
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
        break;
      case 'document':
        this.options.exportFormat = ExportFormats.Document;
        this.fhirService.search('Composition', null, true, null, null, this.configService.igContext.implementationGuideId)
          .subscribe((res) => {
            this.compositions = res.results.map(c => {
              return {
                id: c.resource.id,
                name: (<any> c.resource).title
              };
            });
          });
        break;
      default:
        throw new Error('Unexpected tab selected. Cannot set export format.');
    }
  }

  public async implementationGuideChanged(igConf: IFhirResource) {
    this.selectedImplementationGuide = <ImplementationGuide>igConf.resource;
    this.options.implementationGuideId = igConf ? igConf.id : undefined;

    const cookieKey = Globals.cookieKeys.exportLastImplementationGuideId + '_' + this.configService.fhirVersion;

    if (igConf && igConf.id) {
      this.cookieService.set(cookieKey, igConf.id);
    } else if (this.cookieService.get(cookieKey)) {
      this.cookieService.delete(cookieKey);
    }

    const pubTemplateExt = (igConf.resource.extension || []).find(e => e.url === Globals.extensionUrls['extension-ig-pub-template']);

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
        return this.implementationGuideService.getImplementationGuides(1, term).pipe(
          map((response: SearchImplementationGuideResponseContainer) => {
            return (response.responses || []).map((entry) => <ImplementationGuide>entry.data.resource);
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
    const cookieKey = Globals.cookieKeys.exportLastImplementationGuideId + '_' + this.configService.fhirVersion;

    this.selectedImplementationGuide =
      this.options.implementationGuideId = null;

    if (this.cookieService.get(cookieKey)) {
      this.cookieService.delete(cookieKey);
    }
  }

  public responseFormatChanged(format) {
    if (format === 'application/json' || format === 'application/xml') {
      this.options.responseFormat = format;
    }
    this.cookieService.set(Globals.cookieKeys.lastResponseFormat, this.options.responseFormat);
  }

  public get exportDisabled(): boolean {
    if (!this.options.implementationGuideId || !this.options.exportFormat) {
      return true;
    }

    if (this.options.exportFormat === ExportFormats.HTML) {
      if (this.options.templateType === 'custom-uri' && !this.options.template) {
        return true;
      } else if (this.options.templateType === 'official' && (!this.options.template || !this.options.templateVersion)) {
        return true;
      }
    }

    if (this.options.exportFormat === ExportFormats.Document) {
      return !this.documentOptions.compositionId || this.documentOptions.compositionId === 'null';
    }

    /* TODO: Uncomment after Export GitHub issue is fixed
    if (this.options.exportFormat === ExportFormats.GitHub && this.githubPanel) {
      return !this.githubPanel.canExport;
    }
     */

    return !this.options.responseFormat;
  }

  private async exportGithub() {
    if (!this.githubPanel.canExport) {
      this.message = "The repository, branch, and commit message must be filled for a GitHub export.";
      return;
    }

    this.message = null;

    try {
      await this.githubPanel.export(this.options.responseFormat);
      this.message = 'Done exporting to GitHub!';
    } catch (ex) {
      this.message = getErrorString(ex);
    }
  }

  private async exportDocument() {
    console.log("exportDocument:", !this.documentOptions.compositionId, this.documentOptions.compositionId);
    if (!this.documentOptions.compositionId) {
      this.message = 'You must specify a composition to export as a document';
      return;
    }

    this.message = null;

    try {
      const response = await this.exportService.exportDocument(this.configService.igContext.implementationGuideId, this.documentOptions.compositionId, this.documentOptions.format).toPromise();
      saveAs(response.body, 'bundle-' + this.documentOptions.compositionId + (this.documentOptions.format === 'application/xml' ? '.xml' : '.json'));
    } catch (ex) {
      this.message = getErrorString(ex);
    }
  }

  public export() {
    this.socketOutput = '';
    this.message = 'Exporting...';

    this.cookieService.set(Globals.cookieKeys.exportLastImplementationGuideId + '_' + this.configService.fhirVersion, this.options.implementationGuideId);

    const igName = this.selectedImplementationGuide.name.replace(/\s/g, '_');

    try {
      switch (this.options.exportFormat) {
        case ExportFormats.HTML:
          //Need to discuss the difference between HTML vs Bundle
          this.exportService.exportHtml(this.options)
            .subscribe({
              next: (response) => {
                saveAs(response.body, igName + '.zip');
                this.message = 'Done exporting.';
              },
              error: (err) => {
                this.message = getErrorString(err);
              }
            });
          break;
        case ExportFormats.Bundle:
          this.exportService.exportBundle(this.options)
            .subscribe({
              next: (response) => {
                const extension = this.options.responseFormat === 'application/xml' ? '.xml' : '.json';
                saveAs(response.body, igName + extension);
                this.message = 'Done exporting.';
              },
              error: (err) => {
                this.message = getErrorString(err);
              }
            });
          break;
        case ExportFormats.MSWORD:
          this.exportService.exportMsWord(this.options)
            .subscribe({
              next: (response) => {
                saveAs(response.body, igName + '.docx');
                this.message = 'Done exporting.';
              },
              error: (err) => {
                this.message = getErrorString(err);
              }
            });
          break;
        case ExportFormats.GitHub:
          this.exportGithub();
          break;
        case ExportFormats.Document:
          this.exportDocument();
          break;
      }
    } catch (ex) {
      this.message = ex.message;
    }
  }

  async ngOnInit() {
    if (this.configService.igContext) {
      this.options.implementationGuideId = this.configService.igContext.implementationGuideId;
    }

    if (this.options.implementationGuideId) {
      this.implementationGuideService.getImplementationGuide(this.options.implementationGuideId)
        .subscribe({
          next: (res: IFhirResource) => {
            this.implementationGuideChanged(res);
          },
          error: (err) => this.message = getErrorString(err)
        });
    }

    await this.templateChanged();

    if (this.options.implementationGuideId) {
      this.implementationGuideService.getImplementationGuide(this.options.implementationGuideId)
        .subscribe({
          next: (res: IFhirResource) => {
            this.selectedImplementationGuide = <ImplementationGuide>res.resource;
          },
          error: (err) => this.message = getErrorString(err)
        });
    }
  }
}
