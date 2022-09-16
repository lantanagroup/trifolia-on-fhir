import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SearchParameter as R4SearchParameter, SearchParameter as STU3SearchParameter } from '../../../../../libs/tof-lib/src/lib/r4/fhir';
import { Observable } from 'rxjs';
import { Bundle, OperationOutcome } from '../../../../../libs/tof-lib/src/lib/stu3/fhir';


@Injectable({
  providedIn: 'root'
})
export class SearchParameterService {
  constructor(private http: HttpClient) {
  }

  public save(searchParameter: STU3SearchParameter | R4SearchParameter): Observable<STU3SearchParameter | R4SearchParameter> {
    if (searchParameter.id) {
      const url = '/api/searchParameter/' + encodeURIComponent(searchParameter.id);
      return this.http.put<STU3SearchParameter | R4SearchParameter>(url, searchParameter);
    } else {
      return this.http.post<STU3SearchParameter | R4SearchParameter>('api/searchParameter', searchParameter);
    }
  }

  public search(page = 1, name?: string, implementationGuideId?: string) {
    let url = '/api/searchParameter?page=' + page + '&';

    if (name) {
      url += 'name=' + encodeURIComponent(name) + '&';
    }

    if (implementationGuideId) {
      url += `implementationGuideId=${encodeURIComponent(implementationGuideId)}&`;
    }

    url += '?_sort=name';

    return this.http.get<Bundle>(url);
  }

  public get(id: string) {
    const url = '/api/searchParameter/' + encodeURIComponent(id);
    return this.http.get<R4SearchParameter | STU3SearchParameter | OperationOutcome>(url);
  }

  public delete(id: string) {
    const url = '/api/searchParameter/' + encodeURIComponent(id);
    return this.http.delete(url);
  }
}
