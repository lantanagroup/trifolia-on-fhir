import {Injectable, EventEmitter} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigModel} from '../models/config-model';

@Injectable()
export class ConfigService {
    public config: ConfigModel;
    public fhirServer: string;
    public fhirServerChanged: EventEmitter<string> = new EventEmitter<string>();
    public statusMessage: string;
    public fhirConformance;

    constructor(private http: HttpClient) {
        this.fhirServer = localStorage.getItem('fhirServer');

        this.http.get('/api/config')
            .map(res => <ConfigModel>res)
            .subscribe((config: ConfigModel) => {
                this.config = config;

                if (!this.fhirServer) {
                    this.changeFhirServer(this.config.fhirServers[0].id);
                }
            });
    }

    public changeFhirServer(fhirServer: string) {
        this.fhirServer = fhirServer;
        localStorage.setItem('fhirServer', this.fhirServer);

        this.http.get('/api/config/fhir')
            .subscribe((res) => {
                this.fhirConformance = res;
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
