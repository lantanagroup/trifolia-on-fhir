import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Resource} from '../models/fhir';
import * as Fhir from 'fhir';
import * as FhirResources from '../profiles-resources.json';

@Injectable()
export class FhirService {
    private fhir: Fhir;

    constructor(
        private http: HttpClient) {

        const parser = new Fhir.ParseConformance(false, Fhir.ParseConformance.VERSIONS.STU3);
        parser.parseBundle(FhirResources);

        this.fhir = new Fhir(parser);
    }

    /**
     * Searches the FHIR server for all resources matching the specified ResourceType
     * @param {string} resourceType
     * @param {string} [searchText]
     * @param {boolean} [summary?]
     */
    public search(resourceType: string, searchText?: string, summary?: boolean) {
        // TODO
    }

    /**
     * Retrieves the specified resource id from the FHIR server
     * @param {string} resourceType
     * @param {string} id
     */
    public read(resourceType: string, id: string) {
        // TODO
    }

    /**
     * Retrieves all versions of the specified resource from the FHIR server
     * @param {string} resourceType
     * @param {string} id
     */
    public history(resourceType: string, id: string) {
        // TODO
    }

    /**
     * Retrieves a specific version of the resource from the FHIR server
     * @param {string} resourceType
     * @param {string} id
     * @param {string} versionId
     */
    public vread(resourceType: string, id: string, versionId: string) {
        // TODO
    }

    /**
     * Deletes the specified resource from the FHIR server
     * @param {string} resourceType
     * @param {string} id
     */
    public delete(resourceType: string, id: string) {
        // TODO
    }

    /**
     * Updates the specified resource on the FHIR server
     * @param {string} resourceType
     * @param {string} id
     * @param {Resource} resource
     */
    public update(resourceType: string, id: string, resource: Resource) {
        // TODO
    }

    /**
     * Creates the specified resource on the FHIR server
     * @param {string} resourceType
     * @param {Resource} resource
     */
    public create(resourceType: string, resource: Resource) {
        // TODO
    }

    /**
     * Validates the specified resource using the FHIR-JS module
     * @param {Resource} resource
     * @return {any}
     */
    public validate(resource: Resource) {
        return this.fhir.validate(resource);
    }
}
