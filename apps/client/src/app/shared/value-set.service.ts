import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {IFhirResource} from '@trifolia-fhir/models';
import { IValueSet, Paginated } from '@trifolia-fhir/tof-lib';

@Injectable()
export class ValueSetService {

  constructor(
    private http: HttpClient) {

  }

  public save(valueSetId:string, valueSet: IFhirResource): Observable<IFhirResource> {
    if (valueSetId) {
      const url = '/api/valueSet/' + encodeURIComponent(valueSetId);
      return this.http.put<IFhirResource>(url, valueSet);
    } else {
      return this.http.post<IFhirResource>('/api/valueSet', valueSet);
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


  public searchVsacApi(page = 1, apiKey: string, id?: string, name?: string): Observable<Paginated<IValueSet>> {

    let url = `/api/valueSet/vsac?page=${page}&count=5`;

    if (id) {
      url += `&id=${encodeURIComponent(id)}`;
    } else if (name) {
      url += `&name=${encodeURIComponent(name)}`;
    } else {
      return throwError(() => new Error('Either ID or name must be provided.'));
    }

    let options = {
      headers: {
        'vsacauthorization': `Basic ${btoa('apikey:'+apiKey)}`
      }
    }
    
    return this.http.get<Paginated<IValueSet>>(url, options);
  }

  public getValueSet(id: string) {
    const url = '/api/valueSet/' + encodeURIComponent(id);
    return this.http.get<IFhirResource>(url);
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
