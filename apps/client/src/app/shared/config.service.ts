import {EventEmitter, Injectable} from '@angular/core';
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
    public statusMessage: string;
    public fhirConformance: STU3CapabilityStatement | R4CapabilityStatement;
    public showingIntroduction = false;

    constructor(
        private titleService: Title,
        private http: HttpClient) {

        this.fhirServer = localStorage.getItem('fhirServer');
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

    public getConfig(): Promise<any> {
        return this.http.get('/api/config').pipe(map(res => <ConfigModel> res))
            .toPromise()
            .then((config: ConfigModel) => {
                this.config = config;

                if (!this.fhirServer && this.config.fhirServers.length > 0) {
                    this.fhirServer = this.config.fhirServers[0].id;
                }

                if (this.fhirServer) {
                    this.changeFhirServer(this.fhirServer);
                } else {
                    throw new Error('No FHIR servers available for selection.');
                }
            });
    }

    public changeFhirServer(fhirServer: string) {
        this.fhirServer = fhirServer;

        localStorage.setItem('fhirServer', this.fhirServer);

        this.http.get('/api/config/fhir')
            .subscribe((res: any) => {
                this.fhirConformance = res;
                this.fhirServerChanged.emit(this.fhirServer);
            }, error => {

            });
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
            setTimeout(() => { this.statusMessage = ''; }, timeout);
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
    }
}
