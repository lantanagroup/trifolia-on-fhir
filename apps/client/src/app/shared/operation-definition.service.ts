import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OperationDefinition } from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import { HttpClient } from '@angular/common/http';
import {IFhirResource} from '@trifolia-fhir/models';

@Injectable()
export class OperationDefinitionService {
  constructor(private http: HttpClient) {
  }

  public save(operationDefinitionId:string, operationDefinition: OperationDefinition): Observable<IFhirResource>  {
    if (operationDefinitionId) {
      const url = '/api/operationDefinitions/' + encodeURIComponent(operationDefinitionId);
      return this.http.put<IFhirResource>(url, operationDefinition);
    } else {
      return this.http.post<IFhirResource>('/api/operationDefinitions', operationDefinition);
    }
  }

  public search(page = 1, name?: string, implementationGuideId?: string) {
    let url = '/api/operationDefinitions?resourcetype=OperationDefinition&page=' + page + '&';

    if (name) {
      url += 'name=' + encodeURIComponent(name) + '&';
    }

    if (implementationGuideId) {
      url += `implementationguideid=${encodeURIComponent(implementationGuideId)}&`;
    }

    url += '_sort=name';

    return this.http.get<IFhirResource>(url);
  }

  public get(id: string) {
    let url = '/api/operationDefinitions/' + encodeURIComponent(id);
    return this.http.get<IFhirResource>(url);
  }

  public delete(id: string) {
    const url = '/api/operationDefinitions/' + encodeURIComponent(id);
    return this.http.delete(url);
  }
}
