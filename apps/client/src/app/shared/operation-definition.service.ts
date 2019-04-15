import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Bundle, OperationDefinition, OperationOutcome} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class OperationDefinitionService {
    constructor(private http: HttpClient) {
    }

    public save(operationDefinition: OperationDefinition): Observable<OperationDefinition> {
        if (operationDefinition.id) {
            const url = '/api/operationDefinition/' + encodeURIComponent(operationDefinition.id);
            return this.http.put<OperationDefinition>(url, operationDefinition);
        } else {
            return this.http.post<OperationDefinition>('/api/operationDefinition', operationDefinition);
        }
    }

    public search(page = 1, name?: string) {
        let url = '/api/operationDefinition?page=' + page + '&';

        if (name) {
            url += 'name=' + encodeURIComponent(name) + '&';
        }

        return this.http.get<Bundle>(url);
    }

    public get(id: string) {
        const url = '/api/operationDefinition/' + encodeURIComponent(id);
        return this.http.get<OperationDefinition | OperationOutcome>(url);
    }

    public delete(id: string) {
        const url = '/api/operationDefinition/' + encodeURIComponent(id);
        return this.http.delete(url);
    }
}
