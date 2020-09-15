import {Injectable} from '@angular/core';
import {Bundle, CodeSystem, OperationOutcome} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class CodeSystemService {

  constructor(
      private http: HttpClient) {

  }

    public save(codeSystem: CodeSystem): Observable<CodeSystem> {
        if (codeSystem.id) {
            const url = '/api/codeSystem/' + encodeURIComponent(codeSystem.id);
            return this.http.put<CodeSystem>(url, codeSystem);
        } else {
            return this.http.post<CodeSystem>('/api/codeSystem', codeSystem);
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
        let url = '/api/codeSystem/' + encodeURIComponent(id);
        return this.http.get<CodeSystem | OperationOutcome>(url);
    }

    public delete(id: string) {
        const url = '/api/codeSystem/' + encodeURIComponent(id);
        return this.http.delete(url);
    }
}
