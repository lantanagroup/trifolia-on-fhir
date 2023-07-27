import { Injectable } from '@angular/core';
import { Bundle, CodeSystem, OperationOutcome } from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ICodeSystem } from '../../../../../libs/tof-lib/src/lib/fhirInterfaces';
import { INonFhirResource, IProject, IProjectResourceReferenceMap } from '@trifolia-fhir/models';
import { Paginated } from '@trifolia-fhir/tof-lib';

@Injectable()
export class ExamplesService {

    constructor(
        protected http: HttpClient) {
    }


    public getEmpty(): Observable<INonFhirResource> {
        const url = '/api/nonFhirResources/empty'
        return this.http.get<INonFhirResource>(url);
    }

    public get(id: string): Observable<INonFhirResource> {
        const url = '/api/nonFhirResources/' + encodeURIComponent(id);
        return this.http.get<INonFhirResource>(url);
    }

    public search(page: number = 1, sort: string = 'name', fhirVersion: 'stu3'|'r4'|'r5' = 'r4', implementationGuideId?: string, resourceType?: string, name?: string, title?: string, resourceId?: string): Observable<Paginated<INonFhirResource>> {
        let url = '/api/nonFhirResources?page=' + encodeURIComponent(page) + '&' + '_sort=' + encodeURIComponent(sort) + '&' + 'fhirversion=' + encodeURIComponent(fhirVersion) + '&';

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

        return this.http.get<Paginated<INonFhirResource>>(url);
    }


    public save(exampleId: string, example: INonFhirResource, implementationGuideId?: string): Observable<INonFhirResource> {
        if (exampleId) {
            const url = `/api/nonFhirResources/${encodeURIComponent(exampleId)}${implementationGuideId ? '?implementationguideid=' + encodeURIComponent(implementationGuideId) : ''}`;
            return this.http.put<INonFhirResource>(url, example);
        } else {
            const url = `/api/nonFhirResources/${implementationGuideId ? '?implementationguideid=' + encodeURIComponent(implementationGuideId) : ''}`;
            return this.http.post<INonFhirResource>(url, example);
        }
    }


    public delete(exampleId: string): Observable<any> {
        const url = `/api/nonFhirResources/${encodeURIComponent(exampleId)}`;
        return this.http.delete(url);
    }
    

}
