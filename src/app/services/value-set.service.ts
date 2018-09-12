import {Injectable} from '@angular/core';
import {Bundle, ValueSet} from '../models/stu3/fhir';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class ValueSetService {

    constructor(
        private http: HttpClient) {

    }

    public save(valueSet: ValueSet): Observable<ValueSet> {
        if (valueSet.id) {
            const url = '/api/valueSet/' + encodeURIComponent(valueSet.id);
            return this.http.put<ValueSet>(url, valueSet);
        } else {
            return this.http.post<ValueSet>('/api/valueSet', valueSet);
        }
    }

    public search(page?: number, contentText?: string, urlText?: string) {
        let url = '/api/valueSet?';

        if (page) {
            url += 'page=' + page.toString() + '&';
        }

        if (contentText) {
            url += 'contentText=' + encodeURIComponent(contentText) + '&';
        }

        if (urlText) {
            url += 'urlText=' + encodeURIComponent(urlText) + '&';
        }

        return this.http.get(url);
    }

    public get(id: string) {
        const url = '/api/valueSet/' + encodeURIComponent(id);
        return this.http.get<ValueSet>(url);
    }

    public expand(id: string) {
        const url = '/api/valueSet/' + encodeURIComponent(id) + '/expand';
        return this.http.get<ValueSet>(url);
    }

    public delete(id: string) {
        const url = '/api/valueSet/' + encodeURIComponent(id);
        return this.http.delete(url);
    }
}
