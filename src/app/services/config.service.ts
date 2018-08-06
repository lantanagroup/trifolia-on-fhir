import {Injectable, EventEmitter} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigModel} from '../models/config-model';
import {Route, Router} from '@angular/router';
import {CapabilityStatementComponent as STU3CapabilityStatementComponent} from '../capability-statement-wrapper/stu3/capability-statement.component';
import {CapabilityStatementComponent as R4CapabilityStatementComponent} from '../capability-statement-wrapper/r4/capability-statement.component';
import * as _ from 'underscore';

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
        private http: HttpClient,
        private router: Router) {

        this.fhirServer = localStorage.getItem('fhirServer');

        this.http.get('/api/config')
            .map(res => <ConfigModel>res)
            .subscribe((config: ConfigModel) => {
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
        const shouldRedirect = this.fhirServer !== fhirServer;
        this.fhirServer = fhirServer;

        localStorage.setItem('fhirServer', this.fhirServer);

        this.http.get('/api/config/fhir')
            .subscribe((res: any) => {
                this.fhirConformance = res;

                const fhirVersionRegex = /^(\d+)\.(\d+)\.(\d+)$/g;
                const versionMatch = fhirVersionRegex.exec(res.fhirVersion);

                if (versionMatch) {
                    this.fhirVersion.major = parseInt(versionMatch[1]);
                    this.fhirVersion.minor = parseInt(versionMatch[2]);
                    this.fhirVersion.patch = parseInt(versionMatch[3]);
                }

                if (shouldRedirect) {
                    this.router.navigate(['/']);
                }

                this.fhirServerChanged.emit(this.fhirServer);
            }, error => {

            });
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
