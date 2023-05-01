import { Injectable } from '@angular/core';
import { Bundle, CodeSystem, OperationOutcome } from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ICodeSystem } from '../../../../../libs/tof-lib/src/lib/fhirInterfaces';
import { IExample, IProject, IProjectResourceReferenceMap } from '@trifolia-fhir/models';
import { Paginated } from '@trifolia-fhir/tof-lib';

@Injectable()
export class ExamplesService {

    constructor(
        protected http: HttpClient) {
    }


    public getEmpty(): Observable<IExample> {
        const url = '/api/examples/empty'
        return this.http.get<IExample>(url);
    }

    public get(id: string): Observable<IExample> {
        const url = '/api/examples/' + encodeURIComponent(id);
        return this.http.get<IExample>(url);
    }

    public search(page: number = 1, sort: string = 'name', fhirVersion: 'stu3'|'r4'|'r5' = 'r4', implementationGuideId?: string, resourceType?: string, name?: string, title?: string, resourceId?: string): Observable<Paginated<IExample>> {
        let url = '/api/example?page=' + encodeURIComponent(page) + '&' + '_sort=' + encodeURIComponent(sort) + '&' + 'fhirversion=' + encodeURIComponent(fhirVersion) + '&';

        if (implementationGuideId) {
            url += `implementationguideid=${encodeURIComponent(implementationGuideId)}&`;
        }

        if (resourceType) {
            url += `resourcetype=${encodeURIComponent(resourceType)}&`;
        }

        if (name) {
            url += `name=${encodeURIComponent(name)}&`;
        }

        if (title) {
            url += `title=${encodeURIComponent(title)}&`;
        }

        if (resourceId) {
            url += `resourceid=${encodeURIComponent(resourceId)}&`;
        }

        return this.http.get<Paginated<IExample>>(url);
    }


    public save(exampleId: string, example: IExample, implementationGuideId?: string): Observable<IExample> {
        if (exampleId) {
            const url = `/api/examples/${encodeURIComponent(exampleId)}${implementationGuideId ? '?implementationguideid=' + encodeURIComponent(implementationGuideId) : ''}`;
            return this.http.put<IExample>(url, example);
        } else {
            const url = `/api/examples/${implementationGuideId ? '?implementationguideid=' + encodeURIComponent(implementationGuideId) : ''}`;
            return this.http.post<IExample>(url, example);
        }
    }
    

}
