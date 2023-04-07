import { Injectable } from '@angular/core';
import { Bundle, CodeSystem, OperationOutcome } from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ICodeSystem } from '../../../../../libs/tof-lib/src/lib/fhirInterfaces';
import { IConformance, IProject, IProjectResourceReferenceMap } from '@trifolia-fhir/models';
import { Paginated } from '@trifolia-fhir/tof-lib';

@Injectable()
export class ConformanceService {

    constructor(
        protected http: HttpClient) {
    }


    public getEmpty(): Observable<IConformance> {
        const url = '/api/conformance/empty'
        return this.http.get<IConformance>(url);
    }

    public get(id: string): Observable<IConformance> {
        const url = '/api/conformance/' + encodeURIComponent(id);
        return this.http.get<IConformance>(url);
    }

    public search(page: number = 1, sort: string = 'name', fhirVersion: 'stu3'|'r4'|'r5' = 'r4', implementationGuideId?: string, resourceType?: string, name?: string, title?: string, resourceId?: string): Observable<Paginated<IConformance>> {
        let url = '/api/conformance?page=' + encodeURIComponent(page) + '&' + '_sort=' + encodeURIComponent(sort) + '&' + 'fhirversion=' + encodeURIComponent(fhirVersion) + '&';

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

        return this.http.get<Paginated<IConformance>>(url);
    }


    public getReferenceMap(id: string): Observable<IProjectResourceReferenceMap> {
        const url = `/api/conformance/${encodeURIComponent(id)}/reference-map`;
        return this.http.get<IProjectResourceReferenceMap>(url);
    }

}
