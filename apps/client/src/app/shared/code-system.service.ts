import {Injectable} from '@angular/core';
import {Bundle, CodeSystem, OperationOutcome} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import { ICodeSystem } from '../../../../../libs/tof-lib/src/lib/fhirInterfaces';
import {IConformance, IProject} from '@trifolia-fhir/models';
import { ConformanceService } from './conformance.service';

@Injectable()
export class CodeSystemService extends ConformanceService {

  constructor(
      protected http: HttpClient) {
      super(http);
  }

    public save(codeSystemId:string, codeSystem: IConformance): Observable<IConformance> {
        if (codeSystemId) {
            const url = '/api/codeSystem/' + encodeURIComponent(codeSystemId);
            return this.http.put<IConformance>(url, codeSystem);
        } else {
            return this.http.post<IConformance>('/api/codeSystem', codeSystem);
        }
    }

    public search(page = 1, name?: string, implementationGuideId?: string) :  Observable<IConformance[]> {
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

    public get(id: string): Observable<IConformance> {
        const url = '/api/codeSystem/' + encodeURIComponent(id);
        return this.http.get<IConformance>(url);
    }

    public delete(id: string) {
        const url = '/api/codeSystem/' + encodeURIComponent(id);
        return this.http.delete(url);
    }
}
