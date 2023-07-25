import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IFhirResource, IProjectResourceReferenceMap } from '@trifolia-fhir/models';
import { Paginated } from '@trifolia-fhir/tof-lib';

@Injectable()
export class ConformanceService {

    constructor(
        protected http: HttpClient) {
    }


    public getEmpty(): Observable<IFhirResource> {
        const url = '/api/conformance/empty'
        return this.http.get<IFhirResource>(url);
    }

    public get(id: string): Observable<IFhirResource> {
        const url = '/api/conformance/' + encodeURIComponent(id);
        return this.http.get<IFhirResource>(url);
    }

    public search(page: number = 1, sort: string = 'name', fhirVersion: 'stu3'|'r4'|'r5' = 'r4', implementationGuideId?: string, resourceType?: string, name?: string, title?: string, resourceId?: string): Observable<Paginated<IFhirResource>> {
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

        return this.http.get<Paginated<IFhirResource>>(url);
    }


    public save(conformanceId: string, conformance: IFhirResource, implementationGuideId?: string, isExample?: boolean): Observable<IFhirResource> {
        if (conformanceId) {
            const url = `/api/conformance/${encodeURIComponent(conformanceId)}${implementationGuideId ? '?implementationguideid=' + encodeURIComponent(implementationGuideId) + (isExample ? '&isexample=true' : '') : ''}`;
            return this.http.put<IFhirResource>(url, conformance);
        } else {
            const url = `/api/conformance/${implementationGuideId ? '?implementationguideid=' + encodeURIComponent(implementationGuideId) + (isExample ? '&isexample=true' : '') : ''}`;
            return this.http.post<IFhirResource>(url, conformance);
        }
    }


    public delete(conformanceId: string): Observable<any> {
        const url = `/api/conformance/${encodeURIComponent(conformanceId)}`;
        return this.http.delete(url);
    }


    public getReferenceMap(id: string): Observable<IProjectResourceReferenceMap> {
        const url = `/api/conformance/${encodeURIComponent(id)}/reference-map`;
        return this.http.get<IProjectResourceReferenceMap>(url);
    }

}
