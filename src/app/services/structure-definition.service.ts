import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { StructureDefinitionListItemModel } from '../models/structure-definition-list-item-model';
import {HttpClient} from '@angular/common/http';

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

    public getBaseStructureDefinition(resourceType: string) {
        return this.http.get('/api/structureDefinition/base/' + resourceType);
    }
}
