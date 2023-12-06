import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {IFhirResource} from '@trifolia-fhir/models';


@Injectable()
export class SearchParameterService  {

  constructor(
    protected http: HttpClient) {
  }

  public save(searchParameterId: string, searchParameter: IFhirResource) : Observable<IFhirResource> {
    if (searchParameterId) {
      const url = '/api/searchParameters/' + encodeURIComponent(searchParameter.id);
      return this.http.put<IFhirResource>(url, searchParameter);
    } else {
      return this.http.post<IFhirResource>('/api/searchParameters', searchParameter);
    }
  }

  public search(page = 1, name?: string, implementationGuideId?: string) : Observable<IFhirResource[]> {
    let url = '/api/searchParameters?resourcetype=SearchParameter&page=' + page + '&';

    if (name) {
      url += 'name=' + encodeURIComponent(name) + '&';
    }

    if (implementationGuideId) {
      url += `implementationguideid=${encodeURIComponent(implementationGuideId)}&`;
    }

    url += '_sort=name';

    return this.http.get<IFhirResource[]>(url);
  }

  public get(id: string) {
    const url = '/api/searchParameters/' + encodeURIComponent(id);
    return this.http.get<IFhirResource>(url);
  }

  public delete(id: string) {
    const url = '/api/searchParameters/' + encodeURIComponent(id);
    return this.http.delete(url);
  }
}
