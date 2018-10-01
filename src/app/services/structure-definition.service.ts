import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/map';
import {HttpClient} from '@angular/common/http';
import {OperationOutcome, StructureDefinition} from '../models/stu3/fhir';
import * as _ from 'underscore';
import {StructureDefinitionListModel} from '../models/structure-definition-list-model';
import {FhirService} from './fhir.service';

export class StructureDefinitionImplementationnGuide {
    public id: string;
    public name: string;
    public removed = false;
}

export class StructureDefinitionOptions {
    public implementationGuides: StructureDefinitionImplementationnGuide[] = [];
}

export class GetStructureDefinitionModel {
    public resource: StructureDefinition;
    public options: StructureDefinitionOptions;

    constructor(resource?: StructureDefinition, options?: StructureDefinitionOptions) {
        this.resource = resource;
        this.options = options;
    }
}

@Injectable()
export class StructureDefinitionService {

    constructor(
        private http: HttpClient,
        private fhirService: FhirService) { }

    public getStructureDefinitions(page?: number, contentText?: string, urlText?: string, implementationGuideId?: string): Observable<StructureDefinitionListModel> {
        let url = '/api/structureDefinition?';

        if (page) {
            url += 'page=' + page.toString() + '&';
        }

        if (contentText) {
            url += 'contentText=' + encodeURIComponent(contentText) + '&';
        }

        if (urlText) {
            url += 'urlText=' + encodeURIComponent(urlText) + '&';
        }

        if (implementationGuideId) {
            url += 'implementationGuideId=' + encodeURIComponent(implementationGuideId) + '&';
        }

        return this.http.get(url)
            .map(res => {
                return <StructureDefinitionListModel>res;
            });
    }

    public getStructureDefinition(id: string) {
        return this.http.get<GetStructureDefinitionModel>('/api/structureDefinition/' + id);
    }

    public getBaseStructureDefinition(resourceType: string): Observable<StructureDefinition> {
        return new Observable(subscriber => {
            const foundResource = _.find(this.fhirService.profiles, (profile) => {
                return profile.id === resourceType;
            });

            if (foundResource) {
                subscriber.next(foundResource);
            } else {
                subscriber.error('Could not find base structure definition for ' + resourceType);
            }
        });
        // return this.http.get('/api/structureDefinition/base/' + resourceType);
    }

    public save(structureDefinition: StructureDefinition, options?: StructureDefinitionOptions): Observable<StructureDefinition> {
        let url = '/api/structureDefinition';
        const body = {
            resource: structureDefinition,
            options: options
        };

        if (structureDefinition.id) {
            url += '/' + encodeURIComponent(structureDefinition.id);
            return this.http.put<StructureDefinition>(url, body);
        } else {
            return this.http.post<StructureDefinition>(url, body);
        }
    }

    public delete(id: string) {
        return this.http.delete('/api/structureDefinition/' + encodeURIComponent(id));
    }
}
