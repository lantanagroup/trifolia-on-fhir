import {Injectable} from '@angular/core';
import {Bundle, ValueSet} from '../models/stu3/fhir';
import {Observable} from 'rxjs/Observable';
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

    public search() {
        return this.http.get<Bundle>('/api/valueSet?_summary=true');
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
