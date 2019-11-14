import {Injectable} from '@angular/core';
import {Bundle, CapabilityStatement as STU3CapabilityStatement, OperationOutcome} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {CapabilityStatement as R4CapabilityStatement} from '../../../../../libs/tof-lib/src/lib/r4/fhir';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class CapabilityStatementService {

  constructor(private http: HttpClient) {
  }

  public save(capabilityStatement: STU3CapabilityStatement | R4CapabilityStatement): Observable<STU3CapabilityStatement | R4CapabilityStatement> {
    if (capabilityStatement.id) {
      const url = '/api/capabilityStatement/' + encodeURIComponent(capabilityStatement.id);
      return this.http.put<STU3CapabilityStatement | R4CapabilityStatement>(url, capabilityStatement);
    } else {
      return this.http.post<STU3CapabilityStatement | R4CapabilityStatement>('/api/capabilityStatement', capabilityStatement);
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
    return this.http.get<STU3CapabilityStatement | R4CapabilityStatement | OperationOutcome>(url);
  }

  public delete(id: string) {
    const url = '/api/capabilityStatement/' + encodeURIComponent(id);
    return this.http.delete(url);
  }
}
