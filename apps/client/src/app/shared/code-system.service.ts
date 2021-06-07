import {Injectable} from '@angular/core';
import {Bundle, CodeSystem, OperationOutcome} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import { ICodeSystem } from '../../../../../libs/tof-lib/src/lib/fhirInterfaces';

@Injectable()
export class CodeSystemService {

  constructor(
      private http: HttpClient) {

  }

    public save(codeSystem: ICodeSystem): Observable<ICodeSystem> {
        if (codeSystem.id) {
            const url = '/api/codeSystem/' + encodeURIComponent(codeSystem.id);
            return this.http.put<ICodeSystem>(url, codeSystem);
        } else {
            return this.http.post<ICodeSystem>('/api/codeSystem', codeSystem);
        }
    }

    public search(page = 1, name?: string, implementationGuideId?: string) {
        let url = '/api/codeSystem?page=' + page + '&';

        if (name) {
            url += `name=${encodeURIComponent(name)}&`;
        }

        if (implementationGuideId) {
          url += `implementationGuideId=${encodeURIComponent(implementationGuideId)}&`;
        }

        url += '_sort=name';

        return this.http.get<Bundle>(url);
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
