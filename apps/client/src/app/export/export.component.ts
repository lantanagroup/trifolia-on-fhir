import {Component, OnInit, ViewChild} from '@angular/core';
import {ImplementationGuideService} from '../shared/implementation-guide.service';
import {saveAs} from 'file-saver';
import {ExportOptions, ExportService} from '../shared/export.service';
import {ExportFormats} from '../models/export-formats.enum';
import {Globals} from '../../../../../libs/tof-lib/src/lib/globals';
import {CookieService} from 'angular2-cookie/core';
import {ConfigService} from '../shared/config.service';
import {ImplementationGuide} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {Observable} from 'rxjs';
import {ExportGithubPanelComponent} from '../export-github-panel/export-github-panel.component';
import {debounceTime, distinctUntilChanged, map, switchMap, tap} from 'rxjs/operators';
import {NgbTabChangeEvent} from '@ng-bootstrap/ng-bootstrap';
import {getErrorString} from '../../../../../libs/tof-lib/src/lib/helper';
import {HttpClient} from '@angular/common/http';

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

  @ViewChild('githubPanel', { static: false }) githubPanel: ExportGithubPanelComponent;

  public options = new ExportOptions();
  public selectedImplementationGuide: ImplementationGuide;

  constructor(
    private implementationGuideService: ImplementationGuideService,
    private exportService: ExportService,
    private cookieService: CookieService,
    public configService: ConfigService,
    public http: HttpClient) {

    this.options.implementationGuideId = this.cookieService.get(Globals.cookieKeys.exportLastImplementationGuideId + '_' + this.configService.fhirServer);
    this.options.responseFormat = <any>this.cookieService.get(Globals.cookieKeys.lastResponseFormat) || 'application/json';
    this.options.downloadOutput = true;
    this.options.templateType = <any>this.cookieService.get(Globals.cookieKeys.lastTemplateType) || this.options.templateType;
    this.options.template = <any>this.cookieService.get(Globals.cookieKeys.lastTemplate) || this.options.template;
    this.options.templateVersion = <any>this.cookieService.get(Globals.cookieKeys.lastTemplateVersion) || this.options.templateVersion;
  }

  public async templateTypeChanged() {
    if (this.options.templateType === 'official') {
      this.options.template = 'hl7.fhir.template';
      this.options.templateVersion = 'current';
    } else if (this.options.templateType === 'custom-uri') {
      this.options.template = '';
    }

    this.cookieService.put(Globals.cookieKeys.lastTemplateType, this.options.templateType);
    await this.templateChanged();
  }

  public async templateChanged() {
    this.cookieService.put(Globals.cookieKeys.lastTemplate, this.options.template);

    if (this.options.templateType === 'official') {
      this.templateVersions = await this.configService.getTemplateVersions(this.options);

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
        this.cookieService.remove(Globals.cookieKeys.lastTemplateVersion);
      }
    } else {
      this.cookieService.put(Globals.cookieKeys.lastTemplateVersion, this.options.templateVersion);
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
        break;
      default:
        throw new Error('Unexpected tab selected. Cannot set export format.');
    }
  }

  public implementationGuideChanged(implementationGuide: ImplementationGuide) {
    this.selectedImplementationGuide = implementationGuide;
    this.options.implementationGuideId = implementationGuide ? implementationGuide.id : undefined;

    const cookieKey = Globals.cookieKeys.exportLastImplementationGuideId + '_' + this.configService.fhirServer;

    if (implementationGuide && implementationGuide.id) {
      this.cookieService.put(cookieKey, implementationGuide.id);
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

  public responseFormatChanged() {
    this.cookieService.put(Globals.cookieKeys.lastResponseFormat, this.options.responseFormat);
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

    if (this.options.exportFormat === ExportFormats.GitHub && this.githubPanel) {
      return !this.githubPanel.canExport;
    }

    return !this.options.responseFormat;
  }

  private async exportGithub() {
    if (!this.githubPanel.canExport) return;

    try {
      await this.githubPanel.export();
      this.message = 'Done exporting to GitHub!';
    } catch (ex) {
      this.message = getErrorString(ex);
    }
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

    this.templateChanged();

    if (this.options.implementationGuideId) {
      this.implementationGuideService.getImplementationGuide(this.options.implementationGuideId)
        .subscribe((implementationGuide: ImplementationGuide) => {
          this.selectedImplementationGuide = implementationGuide;
        }, (err) => this.message = getErrorString(err));
    }
  }
}
