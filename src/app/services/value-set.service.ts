import {Injectable} from '@angular/core';
import {OperationOutcome, ValueSet} from '../models/stu3/fhir';
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

    public search(page = 1, name?: string, searchUrl?: string) {
        let url = '/api/valueSet?page=' + page + '&';

        if (name) {
            url += 'name=' + encodeURIComponent(name) + '&';
        }

        if (searchUrl) {
            url += 'url=' + encodeURIComponent(searchUrl) + '&';
        }

        return this.http.get(url);
    }

    public get(id: string) {
        const url = '/api/valueSet/' + encodeURIComponent(id);
        return this.http.get<ValueSet|OperationOutcome>(url);
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
