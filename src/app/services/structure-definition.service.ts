import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { StructureDefinitionListItemModel } from '../models/structure-definition-list-item-model';
import {HttpClient} from '@angular/common/http';
import {Bundle, StructureDefinition, ValueSet} from '../models/stu3/fhir';
import * as _ from 'underscore';
import {StructureDefinitionListModel} from '../models/structure-definition-list-model';
import {FhirService} from './fhir.service';

@Injectable()
export class StructureDefinitionService {

    constructor(
        private http: HttpClient,
        private fhirService: FhirService) { }

    public getStructureDefinitions(page?: number, contentText?: string): Observable<StructureDefinitionListModel> {
        let url = '/api/structureDefinition?';

        if (page) {
            url += 'page=' + page.toString() + '&';
        }

        if (contentText) {
            url += 'contentText=' + encodeURIComponent(contentText) + '&';
        }

        return this.http.get(url)
            .map(res => {
                return <StructureDefinitionListModel>res;
            });
    }

    public getStructureDefinition(id: string) {
        return this.http.get('/api/structureDefinition/' + id);
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

    public save(structureDefinition: StructureDefinition): Observable<StructureDefinition> {
        if (structureDefinition.id) {
            const url = '/api/structureDefinition/' + encodeURIComponent(structureDefinition.id);
            return this.http.put<StructureDefinition>(url, structureDefinition);
        } else {
            return this.http.post<StructureDefinition>('/api/valueSet', structureDefinition);
        }
    }

    public delete(id: string) {
        return this.http.delete('/api/structureDefinition/' + encodeURIComponent(id));
    }
}
