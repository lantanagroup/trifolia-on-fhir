import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Bundle, OperationDefinition} from '../models/stu3/fhir';
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

    public search() {
        return this.http.get<Bundle>('/api/operationDefinition?_summary=true');
    }

    public get(id: string) {
        const url = '/api/operationDefinition/' + encodeURIComponent(id);
        return this.http.get<OperationDefinition>(url);
    }

    public delete(id: string) {
        const url = '/api/operationDefinition/' + encodeURIComponent(id);
        return this.http.delete(url);
    }
}
