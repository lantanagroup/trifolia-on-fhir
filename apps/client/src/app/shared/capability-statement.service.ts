import { Injectable } from '@angular/core';
import { Bundle, CapabilityStatement, OperationOutcome } from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CapabilityStatementService {

  constructor(private http: HttpClient) {
  }

  public save(capabilityStatement: CapabilityStatement): Observable<CapabilityStatement> {
    if (capabilityStatement.id) {
      const url = '/api/capabilityStatement/' + encodeURIComponent(capabilityStatement.id);
      return this.http.put<CapabilityStatement>(url, capabilityStatement);
    } else {
      return this.http.post<CapabilityStatement>('/api/capabilityStatement', capabilityStatement);
    }
  }

  public search(page = 1, name?: string, implementationGuideId?: string) {
    let url = '/api/capabilityStatement?page=' + page + '&';

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
    let url = '/api/capabilityStatement/' + encodeURIComponent(id);
    return this.http.get<CapabilityStatement | OperationOutcome>(url);
  }

  public delete(id: string) {
    const url = '/api/capabilityStatement/' + encodeURIComponent(id);
    return this.http.delete(url);
  }
}
