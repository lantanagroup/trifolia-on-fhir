import {Injectable} from '@angular/core';
import {Bundle, CodeSystem, OperationOutcome} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import { ICodeSystem } from '../../../../../libs/tof-lib/src/lib/fhirInterfaces';
import {IConformance, IProject} from '@trifolia-fhir/models';

@Injectable()
export class CodeSystemService {

  constructor(
      private http: HttpClient) {

  }

    public save(codeSystemId:string, codeSystem: ICodeSystem): Observable<ICodeSystem> {
        if (codeSystemId) {
            const url = '/api/codeSystem/' + encodeURIComponent(codeSystemId);
            return this.http.put<ICodeSystem>(url, codeSystem);
        } else {
            return this.http.post<ICodeSystem>('/api/codeSystem', codeSystem);
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

    public get(id: string) {
        const url = '/api/codeSystem/' + encodeURIComponent(id);
        return this.http.get<CodeSystem | OperationOutcome>(url);
    }

    public delete(id: string) {
        const url = '/api/codeSystem/' + encodeURIComponent(id);
        return this.http.delete(url);
    }
}
