import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bundle} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {IConformance} from '@trifolia-fhir/models';
import {ConformanceService} from './conformance.service';


@Injectable()
export class SearchParameterService  {

  constructor(
    protected http: HttpClient) {
    //super(http);
  }

  /*public save(codeSystemId:string, codeSystem: IConformance): Observable<IConformance> {
    if (codeSystemId) {
      const url = '/api/codeSystem/' + encodeURIComponent(codeSystemId);
      return this.http.put<IConformance>(url, codeSystem);
    } else {
      return this.http.post<IConformance>('/api/codeSystem', codeSystem);
    }
  }
*/
/*
  public searchCodeSystem(page = 1, name?: string, implementationGuideId?: string) :  Observable<IConformance[]> {
    let url = '/api/codeSystem?page=' + page + '&';

    if (name) {
      url += `name=${encodeURIComponent(name)}&`;
    }

    if (implementationGuideId) {
      url += `implementationGuideId=${encodeURIComponent(implementationGuideId)}&`;
    }

    url += '_sort=name';

    return this.http.get<IConformance[]>(url);
  }

  public getCodeSystem(id: string): Observable<IConformance> {
    const url = '/api/codeSystem/' + encodeURIComponent(id);
    return this.http.get<IConformance>(url);
  }

  public delete(id: string) {
    const url = '/api/codeSystem/' + encodeURIComponent(id);
    return this.http.delete(url);
  }
*/


  public save(searchParameterId: string, searchParameter: IConformance) : Observable<IConformance> {
    if (searchParameterId) {
      const url = '/api/searchParameter/' + encodeURIComponent(searchParameter.id);
      return this.http.put<IConformance>(url, searchParameter);
    } else {
      return this.http.post<IConformance>('/api/searchParameter', searchParameter);
    }
  }

  public search(page = 1, name?: string, implementationGuideId?: string) : Observable<IConformance[]> {
    let url = '/api/searchParameter?page=' + page + '&';

    if (name) {
      url += 'name=' + encodeURIComponent(name) + '&';
    }

    if (implementationGuideId) {
      url += `implementationGuideId=${encodeURIComponent(implementationGuideId)}&`;
    }

    url += '?_sort=name';

    return this.http.get<IConformance[]>(url);
  }

  public get(id: string) {
    const url = '/api/searchParameter/' + encodeURIComponent(id);
    return this.http.get<IConformance>(url);
  }

  public delete(id: string) {
    const url = '/api/searchParameter/' + encodeURIComponent(id);
    return this.http.delete(url);
  }
}
