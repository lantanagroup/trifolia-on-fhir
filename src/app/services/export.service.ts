import {Injectable} from '@angular/core';
import {ExportFormats} from '../models/export-formats.enum';
import {HttpClient} from '@angular/common/http';

export class ExportOptions {
    public implementationGuideId: number;
    public exportFormat = ExportFormats.HTML;
    public responseFormat = 'application/json';
    public useTerminologyServer = true;
    public executeIgPublisher = true;
    public useLatest = false;
}

@Injectable()
export class ExportService {

    constructor(
        private http: HttpClient) {
    }

    public export(options: ExportOptions) {
        let url = '/api/export/' + options.implementationGuideId + '?exportFormat=' + options.exportFormat + '&';

        if (options.responseFormat) {
            url += '_format=' + encodeURIComponent(options.responseFormat) + '&';
        }

        if (options.useTerminologyServer === true || options.useTerminologyServer === false) {
            url += 'useTerminologyServer=' + options.useTerminologyServer.toString() + '&';
        }

        if (options.executeIgPublisher === true || options.executeIgPublisher === false) {
            url += 'executeIgPublisher=' + options.executeIgPublisher.toString() + '&';
        }

        if (options.useLatest === true) {
            url += 'useLatest=true&';
        }

        return this.http.post(url, null, { observe: 'response', responseType: 'blob' });
    }

    public getPackage(packageId: string) {
        const url = '/api/export/' + packageId;
        return this.http.get(url, {observe: 'response', responseType: 'blob' });
    }
}
