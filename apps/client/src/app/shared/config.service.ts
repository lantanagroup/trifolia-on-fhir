import {Injectable, Injector} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigModel} from '../../../../../libs/tof-lib/src/lib/config-model';
import {Title} from '@angular/platform-browser';
import {Coding} from '../../../../../libs/tof-lib/src/lib/r4/fhir';
import {Versions} from 'fhir/fhir';
import {map} from 'rxjs/operators';

@Injectable()
export class ConfigService {
  public config: ConfigModel;
  public fhirVersion: string = 'r4';
  public project?: {
    implementationGuideId: string,
    name?: string,
    securityTags?: Coding[]
  };
  public statusMessage: string;
  public showingIntroduction = false;


  constructor(private injector: Injector) {

  }

  /*public async getBinaryResources(igId: string): Promise<Resource[]> {
    let url = '';

    url = '/api/fhir/Binary?_has:ImplementationGuide:resource:_id=<' + igId + '>';

    try {
      const result = await this.http.get(url).toPromise();


    } catch(ex) {

    }

  }*/

  public async getTemplateVersions(template: string): Promise<string[]> {
    let url = '';
    let templateVersions = [];

    if (template === 'hl7.fhir.template') {
      url = 'https://raw.githubusercontent.com/HL7/ig-template-fhir/master/package-list.json';
    } else if (template === 'hl7.cda.template') {
      url = 'https://raw.githubusercontent.com/HL7/ig-template-cda/master/package-list.json';
    } else if (template === 'hl7.base.template') {
      url = 'https://raw.githubusercontent.com/HL7/ig-template-base/master/package-list.json';
    }

    try {
      const result = await this.http.get(url).toPromise();

      if (result.hasOwnProperty('list') && result['list']) {
        for (let x = 0; x < result['list'].length; x++) {
          if (result['list'][x]['version']) {
            templateVersions.push(result['list'][x]['version']);
          }
        }
      }
    } catch (ex) {
      templateVersions = ['current'];
    }

    if (templateVersions.indexOf('dev') < 0) {
      templateVersions.push('dev');
    }

    return templateVersions;
  }

  public get baseSessionUrl(): string {
    if (this.project && this.project.implementationGuideId) {
      return `/projects/${this.project.implementationGuideId}`;
    } else {
      return `/projects`;
    }
  }


  public get titleService(): Title {
    return this.injector.get(Title);
  }

  public get http(): HttpClient {
    return this.injector.get(HttpClient);
  }

  public setFhirVersion(fhirVersion?: string) {
    this.fhirVersion = fhirVersion;
  }


  public get isFhirSTU3() {
    return this.fhirVersion === Versions.STU3.toLowerCase();
  }

  public get isFhirR4() {
    return this.fhirVersion === Versions.R4.toLowerCase();
  }

  public get isFhirR5() {
    return this.fhirVersion === Versions.R5;
  }
  public setTitle(value: string, isDirty: boolean = false) {
    const mainTitle = (isDirty ? '*' : '') + 'Trifolia-on-FHIR';

    if (value) {
      this.titleService.setTitle(`${mainTitle}: ${value}`);
      return;
    }

    this.titleService.setTitle(mainTitle);
  }

  public getConfig(init = false): Promise<any> {
    return this.http.get('/api/config').pipe(map(res => <ConfigModel>res))
      .toPromise()
      .then((config: ConfigModel) => {
        this.config = config;

      });
  }


  public setStatusMessage(message: string, timeout?: number) {
    this.statusMessage = message;

    if (timeout) {
      setTimeout(() => {
        this.statusMessage = '';
      }, timeout);
    }
  }

  public getMessageFromError(error: any, prefix?: string): string {
    let errorMessage: string;

    if (typeof error.message === 'string') {
      errorMessage = error.message;
    } else if (error.data && typeof error.data === 'string') {
      errorMessage = error.data;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    if (prefix) {
      return `${prefix}: ${errorMessage}`;
    }

    return errorMessage;
  }

  public handleError(error: any, prefix?: string) {
    const errorMessage = this.getMessageFromError(error, prefix);
    this.setStatusMessage(errorMessage);
    window.scrollTo(0, 0);
  }
}
