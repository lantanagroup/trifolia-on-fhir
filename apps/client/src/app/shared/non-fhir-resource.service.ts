import { Injectable } from '@angular/core';
import {Bundle, CodeSystem, DomainResource, OperationOutcome} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ICodeSystem } from '../../../../../libs/tof-lib/src/lib/fhirInterfaces';
import { INonFhirResource, IProject, IProjectResourceReferenceMap } from '@trifolia-fhir/models';
import { Paginated } from '@trifolia-fhir/tof-lib';

@Injectable()
export class NonFhirResourceService {

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

    public search(page: number = 1, sort: string = 'name', projections?: any, implementationGuideId?: string, resourceType?: string, name?: string, title?: string): Observable<Paginated<INonFhirResource>> {
        let url = '/api/nonFhirResources?page=' + encodeURIComponent(page) + '&' + '_sort=' + encodeURIComponent(sort) + '&';

        if(projections){
           url += `_projections=${encodeURIComponent(projections)}&`;
        }

        if (implementationGuideId) {
            url += `implementationguideid=${encodeURIComponent(implementationGuideId)}&`;
        }

        if (resourceType) {
            url += `type=${encodeURIComponent(resourceType)}&`;
        }

        if (name) {
            url += `name=${encodeURIComponent(name)}&`;
        }

        if (title) {
            url += `title=${encodeURIComponent(title)}&`;
        }

        return this.http.get<Paginated<INonFhirResource>>(url);
    }


    public save(nonFhirResourceId: string, nonFhirResource: INonFhirResource, implementationGuideId?: string): Observable<INonFhirResource> {
        if (nonFhirResourceId) {
            const url = `/api/nonFhirResources/${encodeURIComponent(nonFhirResourceId)}${implementationGuideId ? '?implementationguideid=' + encodeURIComponent(implementationGuideId) : ''}`;
            return this.http.put<INonFhirResource>(url, nonFhirResource);
        } else {
            const url = `/api/nonFhirResources/${implementationGuideId ? '?implementationguideid=' + encodeURIComponent(implementationGuideId) : ''}`;
            return this.http.post<INonFhirResource>(url, nonFhirResource);
        }
    }


    public delete(id: string): Observable<any> {
        const url = `/api/nonFhirResources/${encodeURIComponent(id)}`;
        return this.http.delete(url);
    }

    public async checkUniqueName(resource: INonFhirResource, implementationGuideId?: string) {
      let url = `/api/nonFhirResources/${resource.type}`;
      url += `/${encodeURIComponent(resource.name)}/$check-name${implementationGuideId ? '?implementationguideid=' + encodeURIComponent(implementationGuideId) : ''}`;
      return await this.http.get<boolean>(url).toPromise();
    }

    public  getByName(resource: INonFhirResource, implementationGuideId?: string): Observable<INonFhirResource> {
      let url = `/api/nonFhirResources/${resource.type}`;
      url += `/${encodeURIComponent(resource.name)}${implementationGuideId ? '?implementationguideid=' + encodeURIComponent(implementationGuideId) : ''}`;
      return  this.http.get<INonFhirResource>(url);
    }

    public deleteByName(resource: INonFhirResource, implementationGuideId?: string): Observable<any> {
      let url = `/api/nonFhirResources/${resource.type}`;
      url += `/${encodeURIComponent(resource.name)}${implementationGuideId ? '?implementationguideid=' + encodeURIComponent(implementationGuideId) : ''}`;
      return this.http.delete(url);
    }
}
