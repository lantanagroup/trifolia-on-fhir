import {EventEmitter, Injectable, Injector} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigModel} from '../../../../../libs/tof-lib/src/lib/config-model';
import {Title} from '@angular/platform-browser';
import {CapabilityStatement as STU3CapabilityStatement} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {CapabilityStatement as R4CapabilityStatement, Coding} from '../../../../../libs/tof-lib/src/lib/r4/fhir';
import {Versions} from 'fhir/fhir';
import {map} from 'rxjs/operators';
import {ExportOptions} from './export.service';
import {identifyRelease as identifyReleaseFunc} from '../../../../../libs/tof-lib/src/lib/fhirHelper';

@Injectable()
export class ConfigService {
  public config: ConfigModel;
  public fhirServer: string;
  public fhirServerChanged: EventEmitter<string> = new EventEmitter<string>();
  public project?: {
    implementationGuideId: string,
    name: string,
    securityTags: Coding[]
  };
  public statusMessage: string;
  public showingIntroduction = false;
  private fhirCapabilityStatements: { [fhirServiceId: string]: STU3CapabilityStatement | R4CapabilityStatement | boolean } = {};

  constructor(private injector: Injector) {
    this.fhirServer = localStorage.getItem('fhirServer');
  }

  public async getTemplateVersions(options: ExportOptions): Promise<string[]> {
    let url = '';
    let templateVersions = [];

    if (options.template === 'hl7.fhir.template') {
      url = 'https://raw.githubusercontent.com/HL7/ig-template-fhir/master/package-list.json';
    } else if(options.template === 'hl7.cda.template') {
      url = 'https://raw.githubusercontent.com/HL7/ig-template-cda/master/package-list.json';
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
    } catch(ex) {
      templateVersions = ['current'];
    }

    return templateVersions;
  }

  public get baseSessionUrl(): string {
    if (this.fhirServer && this.project && this.project.implementationGuideId) {
      return `/${this.fhirServer}/${this.project.implementationGuideId}`;
    } else if (this.fhirServer) {
      return `/${this.fhirServer}`;
    } else {
      return '';
    }
  }

  public get fhirConformance(): STU3CapabilityStatement | R4CapabilityStatement | boolean {
    return this.fhirCapabilityStatements[this.fhirServer];
  }

  public get titleService(): Title {
    return this.injector.get(Title);
  }

  public get http(): HttpClient {
    return this.injector.get(HttpClient);
  }

  public get isFhirSTU3() {
    return identifyReleaseFunc(this.fhirConformanceVersion) === Versions.STU3;
  }

  public get isFhirR4() {
    return identifyReleaseFunc(this.fhirConformanceVersion) === Versions.R4;
  }

  public setTitle(value: string) {
    const mainTitle = 'Trifolia-on-FHIR';

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

        if(localStorage){
          const currentFhirServer = localStorage.getItem('fhirServer');
          const found = this.config.fhirServers.find(fhirServer => {
            return fhirServer.id === currentFhirServer;
          });

          if(!found){
            this.fhirServer = null;
            localStorage.removeItem('fhirServer');
          }
        }

        if (!this.fhirServer && this.config.fhirServers.length > 0) {
          this.fhirServer = this.config.fhirServers[0].id;
        }

        if (this.fhirServer) {
          if (!init) {
            // noinspection JSIgnoredPromiseFromCall
            this.changeFhirServer(this.fhirServer);
          }
        } else {
          throw new Error('No FHIR servers available for selection.');
        }
      });
  }

  public changeFhirServer(fhirServer?: string) {
    // Don't do anything if the fhir server hasn't changed
    if (this.fhirServer === fhirServer && this.fhirConformance) {
      return Promise.resolve();
    }

    if (!fhirServer) {
      if (!this.fhirServer) {
        throw new Error('A fhir server must be specified to change the fhir server');
      } else {
        this.fhirServerChanged.emit(this.fhirServer);
        return Promise.resolve();
      }
    }

    this.fhirServer = fhirServer;
    localStorage.setItem('fhirServer', this.fhirServer);

    // Get the conformance statement from the FHIR server and store it
    return this.http.get('/api/config/fhir').toPromise()
      .then((res: STU3CapabilityStatement | R4CapabilityStatement) => {
        this.fhirCapabilityStatements[this.fhirServer] = res;
        this.fhirServerChanged.emit(this.fhirServer);
      })
      .catch((err) => {
        this.fhirCapabilityStatements[this.fhirServer] = false;
      });
  }

  public identifyRelease(): Versions {
    if (this.fhirConformanceVersion) {
      return identifyReleaseFunc(this.fhirConformanceVersion);
    }

    return Versions.STU3;
  }

  public get fhirConformanceVersion(): string {
    if (this.fhirConformance && typeof this.fhirConformance === 'object') {
      const fhirConformance = <STU3CapabilityStatement | R4CapabilityStatement> this.fhirConformance;
      return fhirConformance.fhirVersion;
    }
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
