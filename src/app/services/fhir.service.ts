import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {
    Bundle,
    CodeSystem,
    Coding, ConceptDefinitionComponent,
    IssueComponent,
    OperationOutcome,
    Resource,
    StructureDefinition,
    ValueSet
} from '../models/stu3/fhir';
import {Observable} from 'rxjs';
import 'rxjs/add/observable/forkJoin';
import * as Fhir from 'fhir';
import * as _ from 'underscore';
import {ConfigService} from './config.service';

export class ParsedUrlModel {
    public resourceType: string;
    public id: string;
    public historyId: string;
}

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

    private getSystemConcepts(concepts: ConceptDefinitionComponent[]): Coding[] {
        let all = [];

        _.each(concepts, (concept) => {
            all.push(new Coding(concept));
            const next = this.getSystemConcepts(concept.concept);
            all = all.concat(next);
        });

        return all;
    }

    public parseReference(reference: string): ParsedUrlModel {
        const parseReferenceRegex = /(Account|ActivityDefinition|AdverseEvent|AllergyIntolerance|Appointment|AppointmentResponse|AuditEvent|Basic|Binary|BodySite|Bundle|CapabilityStatement|CarePlan|CareTeam|ChargeItem|Claim|ClaimResponse|ClinicalImpression|CodeSystem|Communication|CommunicationRequest|CompartmentDefinition|Composition|ConceptMap|Condition|Consent|Contract|Coverage|DataElement|DetectedIssue|Device|DeviceComponent|DeviceMetric|DeviceRequest|DeviceUseStatement|DiagnosticReport|DocumentManifest|DocumentReference|EligibilityRequest|EligibilityResponse|Encounter|Endpoint|EnrollmentRequest|EnrollmentResponse|EpisodeOfCare|ExpansionProfile|ExplanationOfBenefit|FamilyMemberHistory|Flag|Goal|GraphDefinition|Group|GuidanceResponse|HealthcareService|ImagingManifest|ImagingStudy|Immunization|ImmunizationRecommendation|ImplementationGuide|Library|Linkage|List|Location|Measure|MeasureReport|Media|MedicationAdministration|MedicationDispense|MedicationRequest|MedicationStatement|Medication|MessageDefinition|MessageHeader|NamingSystem|NutritionOrder|Observation|OperationDefinition|OperationOutcome|Organization|Patient|PaymentNotice|PaymentReconciliation|Person|PlanDefinition|PractitionerRole|Practitioner|ProcedureRequest|Procedure|ProcessRequest|ProcessResponse|Provenance|QuestionnaireResponse|Questionnaire|ReferralRequest|RelatedPerson|RequestGroup|ResearchStudy|ResearchSubject|RiskAssessment|Schedule|SearchParameter|Sequence|ServiceDefinition|Slot|Specimen|StructureDefinition|StructureMap|Subscription|Substance|SupplyDelivery|SupplyRequest|Task|TestReport|TestScript|ValueSet|VisionPrescription)(\/([A-Za-z0-9\-\.]+))?(\/_history\/([A-Za-z0-9\-\.]{1,64}))?/g;
        const match = parseReferenceRegex.exec(reference);

        if (match) {
            return {
                resourceType: match[1],
                id: match[3],
                historyId: match[5]
            };
        }
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
                    const foundSystem: CodeSystem = _.chain(this.valueSets)
                        .filter((item) => item.resourceType === 'CodeSystem')
                        .find((codeSystem: CodeSystem) => codeSystem.url === include.system)
                        .value();

                    if (foundSystem) {
                        const csCodes = this.getSystemConcepts(foundSystem.concept);
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

    public changeResourceId(resourceType: string, originalId: string, newId: string): Observable<string> {
        const url = `/api/fhirOps/change-id?resourceType=${resourceType}&originalId=${originalId}&newId=${newId}`;
        return this.http.get(url, { responseType: 'text' });
    }

    /**
     * Searches the FHIR server for all resources matching the specified ResourceType
     * @param {string} resourceType
     * @param {string} [searchContent]
     * @param {boolean} [summary?]
     */
    public search(resourceType: string, searchContent?: string, summary?: boolean, searchUrl?: string) {
        let url = '/api/fhir/' + resourceType + '?';

        if (searchContent) {
            url += '_content=' + encodeURIComponent(searchContent) + '&';
        }

        if (searchUrl) {
            url += 'url=' + encodeURIComponent(searchUrl) + '&';
        }

        if (summary === true) {
            url += '_summary=true&';
        }

        return this.http.get(url);
    }

    /**
     * Retrieves the specified resource id from the FHIR server
     * @param {string} resourceType
     * @param {string} id
     */
    public read(resourceType: string, id: string) {
        let url = '/api/fhir/' + resourceType + '/' + id;
        return this.http.get(url);
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
    public update(resourceType: string, id: string, resource: Resource): Observable<Resource> {
        const url = '/api/fhir/' + resourceType + '/' + id;
        return this.http.put<Resource>(url, resource);
    }

    /**
     * Creates the specified resource on the FHIR server
     * @param {string} resourceType
     * @param {Resource} resource
     */
    public create(resourceType: string, resource: Resource) {
        // TODO
    }

    public getFhirTooltip(fhirPath: string) {
        if (!fhirPath || fhirPath.indexOf('.') < 0 || !this.profiles) {
            return '';
        }

        const pathSplit = fhirPath.split('.');
        const resourceType = pathSplit[0];
        const structureDefinition = _.find(this.profiles, (profile) => profile.id === resourceType);

        if (structureDefinition) {
            const definition = structureDefinition.snapshot || structureDefinition.differential;

            if (definition && definition.element) {
                const foundElement = _.find(definition.element, (element) => element.path === fhirPath);

                if (foundElement && foundElement.short) {
                    return foundElement.short;
                }
            }
        }
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

    public getOperationOutcomeMessage(oo: OperationOutcome) {
        if (oo.issue && oo.issue.length > 0) {
            const issues = _.map(oo.issue, (issue: IssueComponent) => {
                if (issue.diagnostics) {
                    return issue.diagnostics;
                } else if (issue.code) {
                    return issue.code;
                } else {
                    return issue.severity;
                }
            });
            return issues.concat(', ');
        } else if (oo.text && oo.text.div) {
            return oo.text.div;
        }
    }
}
