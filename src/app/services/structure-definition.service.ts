import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { StructureDefinitionListItemModel } from '../models/structure-definition-list-item-model';
import {HttpClient} from '@angular/common/http';
import {Bundle, StructureDefinition, ValueSet} from '../models/fhir';
import * as FhirResources from '../profiles-resources.json';
import * as FhirTypes from '../profiles-types.json';
import * as _ from 'underscore';

@Injectable()
export class StructureDefinitionService {

    constructor(private http: HttpClient) { }

    public getStructureDefinitions(): Observable<StructureDefinitionListItemModel[]> {
        return this.http.get('/api/structureDefinition')
            .map(res => {
                return <StructureDefinitionListItemModel[]>res;
            });
    }

    public getStructureDefinition(id: string) {
        return this.http.get('/api/structureDefinition/' + id);
    }

    public getBaseStructureDefinition(resourceType: string): Observable<StructureDefinition> {
        return new Observable(subscriber => {
            const fhirResources = <any> FhirResources;
            const fhirTypes = <any> FhirTypes;
            const allEntries = fhirResources.entry.concat(fhirTypes.entry);
            const foundEntry = _.find(allEntries, (entry) => {
                return entry.resource.resourceType === 'StructureDefinition' && entry.resource.id === resourceType;
            });

            if (foundEntry) {
                subscriber.next(foundEntry.resource);
            } else {
                subscriber.error('Could not find base structure definition for ' + resourceType);
            }
        });
        //return this.http.get('/api/structureDefinition/base/' + resourceType);
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
