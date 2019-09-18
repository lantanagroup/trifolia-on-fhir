import {EventEmitter, Injectable, Injector} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigModel} from '../../../../../libs/tof-lib/src/lib/config-model';
import {Title} from '@angular/platform-browser';
import {CapabilityStatement as STU3CapabilityStatement} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {CapabilityStatement as R4CapabilityStatement} from '../../../../../libs/tof-lib/src/lib/r4/fhir';
import * as semver from 'semver';
import {Versions} from 'fhir/fhir';
import {map} from 'rxjs/operators';

@Injectable()
export class ConfigService {
  public config: ConfigModel;
  public fhirServer: string;
  public fhirServerChanged: EventEmitter<string> = new EventEmitter<string>();
  public project?: {
    implementationGuideId: string,
    name: string
  };
  public statusMessage: string;
  public showingIntroduction = false;
  private fhirCapabilityStatements: { [fhirServiceId: string]: STU3CapabilityStatement | R4CapabilityStatement } = {};

  constructor(private injector: Injector) {
    this.fhirServer = localStorage.getItem('fhirServer');
  }

  public static identifyRelease(fhirVersion: string): Versions {
    if (!fhirVersion) {
      return Versions.STU3;
    } else if (semver.satisfies(fhirVersion, '>= 3.2.0 <= 4.0.0')) {
      return Versions.R4;
    } else if (semver.satisfies(fhirVersion, '>= 1.1.0 <= 3.0.1')) {
      return Versions.STU3;
    } else {
      throw new Error('Unexpected FHIR Version ' + fhirVersion);
    }
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

  public get fhirConformance(): STU3CapabilityStatement | R4CapabilityStatement {
    return this.fhirCapabilityStatements[this.fhirServer];
  }

  public get titleService(): Title {
    return this.injector.get(Title);
  }

  public get http(): HttpClient {
    return this.injector.get(HttpClient);
  }

  public get isFhirSTU3() {
    return ConfigService.identifyRelease(this.fhirConformanceVersion) === Versions.STU3;
  }

  public get isFhirR4() {
    return ConfigService.identifyRelease(this.fhirConformanceVersion) === Versions.R4;
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
      });
  }

  public identifyRelease(): Versions {
    if (this.fhirConformanceVersion) {
      return ConfigService.identifyRelease(this.fhirConformanceVersion);
    }

    return Versions.STU3;
  }

  public get fhirConformanceVersion(): string {
    if (this.fhirConformance) {
      return this.fhirConformance.fhirVersion;
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
