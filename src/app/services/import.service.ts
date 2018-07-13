import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from '../../../node_modules/rxjs';

@Injectable()
export class ImportService {

    constructor(private http: HttpClient) {
    }

    public import(contentType: 'json' | 'xml', body: string): Observable<any> {
        const url = '/api/import';
        const headers = new HttpHeaders({ 'Content-Type': contentType === 'json' ? 'application/json' : 'application/xml' });
        return this.http.post(url, body, { headers: headers });
        //.catch(this._serverError);

    }
}
