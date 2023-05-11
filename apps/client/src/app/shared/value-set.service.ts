import { Injectable } from '@angular/core';
import { OperationOutcome, ValueSet } from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import type { ExpandOptions } from '../../../../../libs/tof-lib/src/lib/stu3/expandOptions';
import {IConformance} from '@trifolia-fhir/models';

@Injectable()
export class ValueSetService {

  constructor(
    private http: HttpClient) {

  }

  public save(valueSetId:string, valueSet: IConformance): Observable<IConformance> {
    if (valueSetId) {
      const url = '/api/valueSet/' + encodeURIComponent(valueSetId);
      return this.http.put<IConformance>(url, valueSet);
    } else {
      return this.http.post<IConformance>('/api/valueSet', valueSet);
    }
  }

  public searchValueSet(page = 1, name?: string, searchUrl?: string, id?: string, implementationGuideId?: string) {
    let url = '/api/valueSet?resourcetype=ValueSet&page=' + encodeURIComponent(page) + '&';

    if (name) {
      url += `name=${encodeURIComponent(name)}&`;
    }

    if (searchUrl) {
      url += `url=${encodeURIComponent(searchUrl)}&`;
    }

    if (id) {
      url += `resourceid=${encodeURIComponent(id)}&`;
    }

    if (implementationGuideId) {
      url += `implementationguideid=${encodeURIComponent(implementationGuideId)}&`;
    }

    url += '_sort=name';

    return this.http.get(url);
  }

  public getValueSet(id: string) {
    const url = '/api/valueSet/' + encodeURIComponent(id);
    return this.http.get<IConformance>(url);
  }

 /* public expand(id: string, options: ExpandOptions, terminologyServer?: string): Observable<ValueSet> {
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
  }*/

  public delete(id: string) {
    const url = '/api/valueSet/' + encodeURIComponent(id);
    return this.http.delete(url);
  }
}
