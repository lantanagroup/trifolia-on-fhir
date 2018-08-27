import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Bundle, CodeSystem, Coding, Resource, StructureDefinition, ValueSet} from '../models/stu3/fhir';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import * as Fhir from 'fhir';
import * as _ from 'underscore';
import {ConfigService} from './config.service';

@Injectable()
export class FhirService {
    private fhir: Fhir;
    public loaded: boolean;
    public profiles: StructureDefinition[] = [];
    public valueSets: ValueSet[] = [];

    constructor(
        private http: HttpClient,
        private configService: ConfigService) {

        this.configService.fhirServerChanged.subscribe(() => this.loadAssets());
    }

    private loadAssets() {
        this.loaded = false;
        let loadDirectory = 'stu3';

        if (this.configService.isFhirR4()) {
            loadDirectory = 'r4';
        }

        const assetPromises = [
            this.http.get('/assets/' + loadDirectory + '/codesystem-iso3166.json'),
            this.http.get('/assets/' + loadDirectory + '/valuesets.json'),
            this.http.get('/assets/' + loadDirectory + '/profiles-types.json'),
            this.http.get('/assets/' + loadDirectory + '/profiles-resources.json')
        ];

        Observable.forkJoin(assetPromises)
            .subscribe((allAssets) => {
                const parser = new Fhir.ParseConformance(false, Fhir.ParseConformance.VERSIONS.STU3);
                parser.loadCodeSystem(allAssets[0]);
                parser.parseBundle(allAssets[1]);
                parser.parseBundle(allAssets[2]);
                parser.parseBundle(allAssets[3]);

                this.fhir = new Fhir(parser);

                _.each((<Bundle>allAssets[1]).entry, (entry) => this.valueSets.push(entry.resource));
                _.each((<Bundle>allAssets[2]).entry, (entry) => this.profiles.push(entry.resource));
                _.each((<Bundle>allAssets[3]).entry, (entry) => this.profiles.push(entry.resource));

                this.loaded = true;
            }, (err) => {
                console.log('Error loading assets');
            });
    }

    public getValueSetCodes(valueSetUrl: string): Coding[] {
        let codes: Coding[] = [];
        const foundValueSet = _.chain(this.valueSets)
            .filter((item) => item.resourceType === 'ValueSet')
            .find((valueSet) => valueSet.url === valueSetUrl)
            .value();

        if (foundValueSet) {
            if (foundValueSet.compose) {
                _.each(foundValueSet.compose.include, (include) => {
                    const foundSystem = _.chain(this.valueSets)
                        .filter((item) => item.resourceType === 'CodeSystem')
                        .find((codeSystem: CodeSystem) => codeSystem.url === include.system)
                        .value();

                    if (foundSystem) {
                        const csCodes = _.map(foundSystem.concept, (concept) => {
                            return {
                                system: include.system,
                                code: concept.code,
                                display: concept.display || concept.code
                            };
                        });
                        codes = codes.concat(csCodes);
                    }

                    const includeCodes = _.map(include.concept, (concept) => {
                        return {
                            system: include.system,
                            code: concept.code,
                            display: concept.display || concept.code
                        };
                    });
                    codes = codes.concat(includeCodes);
                });
            }
        }

        return codes;
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

    public serialize(resource: Resource) {
        return this.fhir.objToXml(resource);
    }

    public deserialize(resourceXml: string) {
        return this.fhir.xmlToObj(resourceXml);
    }
}
