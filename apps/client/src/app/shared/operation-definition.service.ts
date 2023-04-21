import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Bundle, OperationDefinition, OperationOutcome } from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import { HttpClient } from '@angular/common/http';
import {IConformance} from '@trifolia-fhir/models';

@Injectable()
export class OperationDefinitionService {
  constructor(private http: HttpClient) {
  }

  public save(operationDefinitionId:string, operationDefinition: OperationDefinition): Observable<IConformance>  {
    if (operationDefinitionId) {
      const url = '/api/operationDefinition/' + encodeURIComponent(operationDefinitionId);
      return this.http.put<IConformance>(url, operationDefinition);
    } else {
      return this.http.post<IConformance>('/api/operationDefinition', operationDefinition);
    }
  }

  public search(page = 1, name?: string, implementationGuideId?: string) {
    let url = '/api/operationDefinition?resourcetype=OperationDefinition&page=' + page + '&';

    if (name) {
      url += 'name=' + encodeURIComponent(name) + '&';
    }

    if (implementationGuideId) {
      url += `implementationguideid=${encodeURIComponent(implementationGuideId)}&`;
    }

    url += '_sort=name';

    return this.http.get<IConformance>(url);
  }

  public get(id: string) {
    let url = '/api/operationDefinition/' + encodeURIComponent(id);
    return this.http.get<IConformance>(url);
  }

  public delete(id: string) {
    const url = '/api/operationDefinition/' + encodeURIComponent(id);
    return this.http.delete(url);
  }
}
