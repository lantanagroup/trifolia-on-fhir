import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/map';
import {HttpClient} from '@angular/common/http';
import {Bundle, StructureDefinition} from '../models/stu3/fhir';
import * as _ from 'underscore';
import {FhirService} from './fhir.service';
import {FileService} from './file.service';

export class StructureDefinitionImplementationnGuide {
    public id: string;
    public name: string;
    public isRemoved = false;
    public isNew = false;
}

export class StructureDefinitionOptions {
    public implementationGuides: StructureDefinitionImplementationnGuide[] = [];
}

export class GetStructureDefinitionModel {
    public resource: StructureDefinition;
    public options?: StructureDefinitionOptions;

    constructor(resource?: StructureDefinition, options?: StructureDefinitionOptions) {
        this.resource = resource;
        this.options = options;
    }
}

@Injectable()
export class StructureDefinitionService {

    constructor(
        private http: HttpClient,
        private fhirService: FhirService,
        private fileService: FileService) { }

    public getStructureDefinitions(page?: number, nameText?: string, urlText?: string, implementationGuideId?: string): Observable<Bundle> {
        let url = '/api/structureDefinition?';

        if (page) {
            url += 'page=' + page.toString() + '&';
        }

        if (nameText) {
            url += 'name=' + encodeURIComponent(nameText) + '&';
        }

        if (urlText) {
            url += 'urlText=' + encodeURIComponent(urlText) + '&';
        }

        if (implementationGuideId) {
            url += 'implementationGuideId=' + encodeURIComponent(implementationGuideId) + '&';
        }

        return this.http.get<Bundle>(url);
    }

    public getStructureDefinition(id: string): Observable<GetStructureDefinitionModel> {
        if (id === 'from-file') {
            if (this.fileService.file) {
                return new Observable<GetStructureDefinitionModel>((observer) => {
                    observer.next({
                        resource: <StructureDefinition> this.fileService.file.resource
                    });
                });
            }
        }

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
