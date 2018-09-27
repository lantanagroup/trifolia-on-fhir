import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigModel} from '../models/config-model';
import {Globals} from '../globals';
import {Title} from '@angular/platform-browser';

@Injectable()
export class ConfigService {
    public config: ConfigModel;
    public fhirServer: string;
    public fhirServerChanged: EventEmitter<string> = new EventEmitter<string>();
    public statusMessage: string;
    public fhirConformance;
    public fhirVersion = {
        major: 3,
        minor: 0,
        patch: 1
    };

    constructor(
        private globals: Globals,
        private titleService: Title,
        private http: HttpClient) {

        this.fhirServer = localStorage.getItem('fhirServer');
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
        return this.http.get('/api/config')
            .map(res => <ConfigModel>res)
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
        const serverChanged = this.fhirServer !== fhirServer;
        this.fhirServer = fhirServer;

        localStorage.setItem('fhirServer', this.fhirServer);

        this.http.get('/api/config/fhir')
            .subscribe((res: any) => {
                this.fhirConformance = res;
                this.fhirVersion = this.globals.parseFhirVersion(res.fhirVersion);
                this.fhirServerChanged.emit(this.fhirServer);
            }, error => {

            });
    }

    public isFhirR4() {
        return this.fhirVersion &&
            this.fhirVersion.major >= 3 &&
            this.fhirVersion.minor >= 2;
    }

    public isFhirDstu3() {
        return !this.fhirVersion ||
            (this.fhirVersion.major === 3 && this.fhirVersion.minor < 2) ||
            this.fhirVersion.major < 3;
    }

    public setStatusMessage(message: string, timeout?: number) {
        this.statusMessage = message;

        if (timeout) {
            setTimeout(() => { this.statusMessage = ''; }, timeout);
        }
    }

    public handleError(messageFormat: string, error: any) {
        let errorMessage: string;

        if (error.message) {
            errorMessage = error.message;
        } else if (error.data && typeof error.data === 'string') {
            errorMessage = error.data;
        } else if (typeof error === 'string') {
            errorMessage = error;
        }

        if (errorMessage) {
            this.setStatusMessage(`${messageFormat}\r\n${errorMessage}`);
        } else {
            this.setStatusMessage(messageFormat);
        }
    }
}
