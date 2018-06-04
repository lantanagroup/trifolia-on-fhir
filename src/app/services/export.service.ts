import {Injectable} from '@angular/core';
import {ExportFormats} from '../models/export-formats.enum';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class ExportService {

    constructor(
        private http: HttpClient) {
    }

    public export(implementationGuideId: number, exportFormat: ExportFormats, responseFormat?: string) {
        let url = '/api/export/' + implementationGuideId + '?exportFormat=' + exportFormat + '&';

        if (responseFormat) {
            url += '_format=' + encodeURIComponent(responseFormat);
        }

        return this.http.post(url, null, { observe: 'response', responseType: 'blob' });
    }

    public getPackage(packageId: string) {
        const url = '/api/export/' + packageId;
        return this.http.get(url, {observe: 'response', responseType: 'blob' });
    }
}
