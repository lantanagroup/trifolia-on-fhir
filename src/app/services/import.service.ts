import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from '../../../node_modules/rxjs';


export class VSACImportCriteria {
    public resourceType = 'ValueSet';
    public id: string;
    public username: string;
    public password: string;
}

@Injectable()
export class ImportService {

    constructor(private http: HttpClient) {
    }

    public import(contentType: 'json' | 'xml', body: string): Observable<any> {
        const url = '/api/import';
        const headers = new HttpHeaders({ 'Content-Type': contentType === 'json' ? 'application/json' : 'application/xml' });
        return this.http.post(url, body, { headers: headers });
    }

    public importVsac(criteria: VSACImportCriteria): Observable<any> {
        return new Observable<any>((subscriber) => {
            const url = '/api/import/vsac/' + criteria.resourceType + '/' + criteria.id;
            const authorization = btoa(criteria.username + ':' + criteria.password);
            const headers = {
                'vsacAuthorization': 'Basic ' + authorization
            };
            this.http.get(url, { headers: headers })
                .subscribe((results) => {
                    subscriber.next(results);
                }, (err) => {
                    subscriber.error(err);
                });
        });
    }
}
