import {Injectable} from '@angular/core';
import {Bundle, CapabilityStatement as STU3CapabilityStatement, OperationOutcome} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {CapabilityStatement as R4CapabilityStatement} from '../../../../../libs/tof-lib/src/lib/r4/fhir';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {IFhirResource} from '@trifolia-fhir/models';

@Injectable()
export class CapabilityStatementService {

  constructor(private http: HttpClient) {
  }

  public save(capabilityStatementId, capabilityStatement: IFhirResource): Observable<IFhirResource> {
    if (capabilityStatementId) {
      const url = '/api/capabilityStatement/' + encodeURIComponent(capabilityStatementId);
      return this.http.put<IFhirResource>(url, capabilityStatement);
    } else {
      return this.http.post<IFhirResource>('/api/capabilityStatement', capabilityStatement);
    }
  }

  public search(page = 1, name?: string, implementationGuideId?: string) {
    let url = '/api/capabilityStatement?resourcetype=CapabilityStatement' + '&page=' + page + '&';

    if (name) {
      url += 'name=' + encodeURIComponent(name) + '&';
    }

    if (implementationGuideId) {
      url += `implementationguideid=${encodeURIComponent(implementationGuideId)}&`;
    }

    url += '_sort=name';

    return this.http.get<Bundle>(url);
  }

  public get(id: string) {
    let url = '/api/capabilityStatement/' + encodeURIComponent(id);
    return this.http.get<IFhirResource>(url);
  }

  public delete(id: string) {
    const url = '/api/capabilityStatement/' + encodeURIComponent(id);
    return this.http.delete(url);
  }
}
