import { Injectable } from '@angular/core';
import {Bundle, CapabilityStatement} from '../models/stu3/fhir';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class CapabilityStatementService {

  constructor(private http: HttpClient) { }

    public save(capabilityStatement: CapabilityStatement): Observable<CapabilityStatement> {
        if (capabilityStatement.id) {
            const url = '/api/capabilityStatement/' + encodeURIComponent(capabilityStatement.id);
            return this.http.put<CapabilityStatement>(url, capabilityStatement);
        } else {
            return this.http.post<CapabilityStatement>('/api/capabilityStatement', capabilityStatement);
        }
    }

    public search() {
        return this.http.get<Bundle>('/api/capabilityStatement?_summary=true');
    }

    public get(id: string) {
        const url = '/api/capabilityStatement/' + encodeURIComponent(id);
        return this.http.get<CapabilityStatement>(url);
    }

    public delete(id: string) {
        const url = '/api/capabilityStatement/' + encodeURIComponent(id);
        return this.http.delete(url);
    }
}
