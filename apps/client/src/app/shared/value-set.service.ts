import {Injectable} from '@angular/core';
import {OperationOutcome, ValueSet} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ExpandOptions} from '../../../../../libs/tof-lib/src/lib/stu3/expandOptions';

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

    public search(page = 1, name?: string, searchUrl?: string, id?: string) {
        let url = '/api/valueSet?page=' + page + '&';

        if (name) {
            url += 'name=' + encodeURIComponent(name) + '&';
        }

        if (searchUrl) {
            url += 'url=' + encodeURIComponent(searchUrl) + '&';
        }

        if (id) {
            url += '_id=' + encodeURIComponent(id) + '&';
        }

        return this.http.get(url);
    }

    public get(id: string) {
        const url = '/api/valueSet/' + encodeURIComponent(id);
        return this.http.get<ValueSet|OperationOutcome>(url);
    }

    public expand(id: string, options: ExpandOptions, terminologyServer?: string): Observable<ValueSet> {
        if (!terminologyServer) {
            const url = '/api/valueSet/' + encodeURIComponent(id) + '/expand';
            return this.http.post<ValueSet>(url, options);
        } else {
            const thisUrl = '/api/valueSet/' + encodeURIComponent(id);
            let url = terminologyServer + (terminologyServer.endsWith('/') ? '' : '/') + 'ValueSet/$expand?';

            for (let key of Object.keys(options)) {
                url += encodeURIComponent(key) + '=' + encodeURIComponent(options[key]) + '&';
            }

            return new Observable((observer) => {
                this.http.get<ValueSet>(thisUrl)
                    .subscribe((valueSet) => {
                        this.http.post<ValueSet>(url, valueSet)
                            .subscribe((expandedValueSet) => {
                                observer.next(expandedValueSet);
                                observer.complete();
                            }, (err) => {
                                if (err.error && err.error.resourceType === 'OperationOutcome') {
                                    observer.next(err.error);
                                } else {
                                    observer.error(err);
                                }
                                observer.complete();
                            });
                    }, (err) => {
                        observer.error(err);
                        observer.complete();
                    });
            });
        }
    }

    public delete(id: string) {
        const url = '/api/valueSet/' + encodeURIComponent(id);
        return this.http.delete(url);
    }
}
