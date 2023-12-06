import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IFhirResource, IProjectResourceReferenceMap } from '@trifolia-fhir/models';
import { Paginated } from '@trifolia-fhir/tof-lib';

@Injectable()
export class FhirResourceService {

    constructor(
        protected http: HttpClient) {
    }


    public getEmpty(): Observable<IFhirResource> {
        const url = '/api/fhirResources/empty'
        return this.http.get<IFhirResource>(url);
    }

    public get(id: string): Observable<IFhirResource> {
        const url = '/api/fhirResources/' + encodeURIComponent(id);
        return this.http.get<IFhirResource>(url);
    }

    public search(page: number = 1, sort: string = 'name', fhirVersion: 'stu3'|'r4'|'r5' = 'r4', implementationGuideId?: string, resourceType?: string, name?: string, title?: string, resourceId?: string): Observable<Paginated<IFhirResource>> {
        let url = '/api/fhirResources?page=' + encodeURIComponent(page) + '&' + '_sort=' + encodeURIComponent(sort) + '&' + 'fhirversion=' + encodeURIComponent(fhirVersion) + '&';

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


    public save(fhirResourceId: string, fhirResource: IFhirResource, implementationGuideId?: string, isExample?: boolean): Observable<IFhirResource> {
        if (fhirResourceId) {
            const url = `/api/fhirResources/${encodeURIComponent(fhirResourceId)}${implementationGuideId ? '?implementationguideid=' + encodeURIComponent(implementationGuideId) + (isExample ? '&isexample=true' : '') : ''}`;
            return this.http.put<IFhirResource>(url, fhirResource);
        } else {
            const url = `/api/fhirResources/${implementationGuideId ? '?implementationguideid=' + encodeURIComponent(implementationGuideId) + (isExample ? '&isexample=true' : '') : ''}`;
            return this.http.post<IFhirResource>(url, fhirResource);
        }
    }


    public delete(fhirResourceId: string): Observable<any> {
        const url = `/api/fhirResources/${encodeURIComponent(fhirResourceId)}`;
        return this.http.delete(url);
    }


    public getReferenceMap(id: string): Observable<IProjectResourceReferenceMap> {
        const url = `/api/fhirResources/${encodeURIComponent(id)}/reference-map`;
        return this.http.get<IProjectResourceReferenceMap>(url);
    }

    public getWithReferences(id: string): Observable<IFhirResource> {
      const url = `/api/fhirResources/${encodeURIComponent(id)}/references`;
      return this.http.get<IFhirResource>(url);
    }

}
