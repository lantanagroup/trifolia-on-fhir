import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {IConformance} from '@trifolia-fhir/models';


@Injectable()
export class SearchParameterService  {

  constructor(
    protected http: HttpClient) {
  }

  public save(searchParameterId: string, searchParameter: IConformance) : Observable<IConformance> {
    if (searchParameterId) {
      const url = '/api/searchParameter/' + encodeURIComponent(searchParameter.id);
      return this.http.put<IConformance>(url, searchParameter);
    } else {
      return this.http.post<IConformance>('/api/searchParameter', searchParameter);
    }
  }

  public search(page = 1, name?: string, implementationGuideId?: string) : Observable<IConformance[]> {
    let url = '/api/searchParameter?resourcetype=SearchParameter&page=' + page + '&';

    if (name) {
      url += 'name=' + encodeURIComponent(name) + '&';
    }

    if (implementationGuideId) {
      url += `implementationguideid=${encodeURIComponent(implementationGuideId)}&`;
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
