import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {
    Bundle,
    CodeSystem,
    Coding, ConceptDefinitionComponent, ConceptSetComponent, DomainResource, ImplementationGuide,
    IssueComponent,
    OperationOutcome, PackageComponent, PackageResourceComponent, PageComponent,
    Resource,
    StructureDefinition,
    ValueSet
} from '../models/stu3/fhir';
import {
    ImplementationGuide as R4ImplementationGuide,
    ImplementationGuidePageComponent,
    ImplementationGuideResourceComponent
} from '../models/r4/fhir';
import {Observable} from 'rxjs';
import 'rxjs/add/observable/forkJoin';
import {Fhir} from 'fhir/fhir';
import {ParseConformance} from 'fhir/parseConformance';
import {Versions as FhirVersions} from 'fhir/fhir';
import * as _ from 'underscore';
import {ConfigService} from './config.service';
import {ValidatorMessage, ValidatorResponse} from 'fhir/validator';
import {Globals} from '../globals';

export class ParsedUrlModel {
    public resourceType: string;
    public id: string;
    public historyId: string;
}

export interface IResourceGithubDetails {
    owner: string;
    repository: string;
    branch: string;
    path: string;
}

export class ResourceGithubDetails implements IResourceGithubDetails {
    owner: string;
    repository: string;
    branch: string;
    path: string;

    public hasAllDetails(): boolean {
        return !!(this.owner && this.repository && this.branch && this.path);
    }
}

@Injectable()
export class FhirService {
    private fhir: Fhir;
    public loaded: boolean;
    public profiles: StructureDefinition[] = [];
    public valueSets: ValueSet[] = [];
    private customValidator: CustomValidator;

    readonly profileTypes = ['ImplementationGuide', 'StructureDefinition', 'CapabilityStatement', 'OperationDefinition', 'SearchParameter'];
    readonly terminologyTypes = ['ValueSet', 'CodeSystem', 'ConceptMap'];

    constructor(
        private http: HttpClient,
        private globals: Globals,
        private configService: ConfigService) {

        this.customValidator = new CustomSTU3Validator(this);
        this.configService.fhirServerChanged.subscribe(() => {
            this.loadAssets();

            if (this.configService.isFhirR4()) {
                this.customValidator = new CustomR4Validator(this);
            } else {            // Assume default of STU3
                this.customValidator = new CustomSTU3Validator(this);
            }
        });
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
                const parser = new ParseConformance(false, FhirVersions.STU3);
                parser.loadCodeSystem(allAssets[0]);
                parser.parseBundle(allAssets[1]);
                parser.parseBundle(allAssets[2]);
                parser.parseBundle(allAssets[3]);

                this.fhir = new Fhir(parser);

                _.each((<Bundle>allAssets[1]).entry, (entry) => this.valueSets.push(<ValueSet> entry.resource));
                _.each((<Bundle>allAssets[2]).entry, (entry) => this.profiles.push(<StructureDefinition> entry.resource));
                _.each((<Bundle>allAssets[3]).entry, (entry) => this.profiles.push(<StructureDefinition> entry.resource));

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

    public getResourceGithubDetails(resource: DomainResource): ResourceGithubDetails  {
        const branchExtension = _.find(resource.extension, (extension) => extension.url === this.globals.extensionGithubBranch);
        const pathExtension = _.find(resource.extension, (extension) => extension.url === this.globals.extensionGithubPath);
        const pathSplit = pathExtension && pathExtension.valueString ? pathExtension.valueString.split('/') : [];

        const details = new ResourceGithubDetails();
        details.owner = pathSplit.length >= 1 ? pathSplit[0] : null;
        details.repository = pathSplit.length >= 2 ? pathSplit[1] : null;
        details.branch = branchExtension && branchExtension.valueString ? branchExtension.valueString : null;
        details.path = pathSplit.length >= 3 ? pathSplit.slice(2).join('/') : null;

        return details;
    }

    public setResourceGithubDetails(resource: DomainResource, details: IResourceGithubDetails) {
        if (!resource.extension) {
            resource.extension = [];
        }

        let branchExtension = _.find(resource.extension, (extension) => extension.url === this.globals.extensionGithubBranch);
        let pathExtension = _.find(resource.extension, (extension) => extension.url === this.globals.extensionGithubPath);

        if (!branchExtension) {
            branchExtension = { url: this.globals.extensionGithubBranch };
            resource.extension.push(branchExtension);
        }

        if (!pathExtension) {
            pathExtension = { url: this.globals.extensionGithubPath };
            resource.extension.push(pathExtension);
        }

        branchExtension.valueString = details.branch;
        pathExtension.valueString = details.owner + '/' + details.repository + '/' + (details.path.startsWith('/') ? details.path.substring(1) : details.path);
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
                _.each(foundValueSet.compose.include, (include: ConceptSetComponent) => {
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
    public validate(resource: Resource): ValidatorResponse {
        return this.fhir.validate(resource, {
            onBeforeValidateResource: (nextResource) => this.validateResource(nextResource)
        });
    }

    public serialize(resource: Resource) {
        return this.fhir.objToXml(resource);
    }

    public deserialize(resourceXml: string) {
        return this.fhir.xmlToObj(resourceXml);
    }

    public getOperationOutcomeMessage(oo: OperationOutcome): string {
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
            return issues.join(', ');
        } else if (oo.text && oo.text.div) {
            return oo.text.div;
        }
    }

    private validateResource(resource: any): ValidatorMessage[] {
        if (!this.customValidator) {
            return;
        }

        switch (resource.resourceType) {
            case 'ImplementationGuide':
                return this.customValidator.validateImplementationGuide(resource);
            // TODO: add more custom logic per each resource
        }
    }
}

abstract class CustomValidator {
    protected fhirService: FhirService;

    protected constructor(fhirService: FhirService) {
        this.fhirService = fhirService;
    }

    public abstract validateImplementationGuide(implementationGuide: any): ValidatorMessage[];
}

class CustomSTU3Validator extends CustomValidator {
    constructor(fhirService: FhirService) { super(fhirService); }

    private getAllPages(implementationGuide: ImplementationGuide): PageComponent[] {
        const pages: PageComponent[] = [];

        function next(page: PageComponent) {
            pages.push(page);
            _.each(page.page, (nextPage) => next(nextPage));
        }

        if (implementationGuide.page) {
            next(implementationGuide.page);
        }

        return pages;
    }

    public validateImplementationGuide(implementationGuide: ImplementationGuide): ValidatorMessage[] {
        const messages = [];
        const allResources = _.flatten(_.map(implementationGuide.package, (nextPackage: PackageComponent) => nextPackage.resource));
        const groupedResources = _.groupBy(allResources, (resource: PackageResourceComponent) => resource.sourceReference ? resource.sourceReference.reference : resource.sourceUri);
        const allPages = this.getAllPages(implementationGuide);
        const groupedPageTitles = _.groupBy(allPages, (page: PageComponent) => page.title);
        const groupedPageFileNames = _.groupBy(allPages, (page: PageComponent) => page.source);

        const exampleTypeResources = _.filter(allResources, (resource: PackageResourceComponent) => {
            const parsedReference = resource.sourceReference && resource.sourceReference.reference ?
                this.fhirService.parseReference(resource.sourceReference.reference) : null;

            if (parsedReference) {
                return this.fhirService.profileTypes.concat(this.fhirService.terminologyTypes).indexOf(parsedReference.resourceType) < 0;
            }
        });

        _.each(exampleTypeResources, (resource: PackageResourceComponent) => {
            if (!resource.example) {
                messages.push({
                    location: 'ImplementationGuide.package.resource',
                    resourceId: resource.id,
                    severity: 'warning',
                    message: 'Resource with reference "' + resource.sourceReference.reference + '" should be flagged as an example.'
                });
            }
        });

        _.each(groupedResources, (resourceGroup, reference) => {
            if (resourceGroup.length > 1) {
                messages.push({
                    location: 'ImplementationGuide.package.resource',
                    resourceId: implementationGuide.id,
                    severity: 'warning',
                    message: `Multiple resources found with reference ${reference || '""'}`
                });
            }
        });

        if (_.filter(allPages, (page) => !page.title).length > 0) {
            messages.push({
                location: 'ImplementationGuide.page+',
                resourceId: implementationGuide.id,
                severity: 'warning',
                message: 'One more more pages does not have a title'
            });
        }

        _.each(groupedPageTitles, (pages, title) => {
            if (pages.length > 1) {
                messages.push({
                    location: 'ImplementationGuide.page+',
                    resourceId: implementationGuide.id,
                    severity: 'warning',
                    message: `Multiple pages found with the same title ${title || '""'}`
                });
            }
        });

        _.each(groupedPageFileNames, (pages, fileName) => {
            if (pages.length > 1) {
                messages.push({
                    location: 'ImplementationGuide.page+',
                    resourceId: implementationGuide.id,
                    severity: 'warning',
                    message: `Multiple pages found with the same source (file name) ${fileName || '""'}`
                });
            }
        });

        _.each(allPages, (page: PageComponent) => {
            const foundContentExtension = _.find(page.extension, (extension) => extension.url === 'https://trifolia-on-fhir.lantanagroup.com/StructureDefinition/extension-ig-page-content');

            if (!foundContentExtension) {
                messages.push({
                    location: 'ImplementationGuide.page+',
                    resourceId: implementationGuide.id,
                    severity: 'warning',
                    message: `The page with title ${page.title} does not specify content.`
                });
            }
        });

        _.each(allResources, (resource: PackageResourceComponent) => {
            if (resource.sourceUri) {
                messages.push({
                    location: 'ImplementationGuide.package.resource',
                    resourceId: implementationGuide.id,
                    severity: 'warning',
                    message: `A resource within a package uses a URI ${resource.sourceUri} instead of a relative reference. This resource will not export correctly.`
                });
            }
        })

        return messages;
    }
}

class CustomR4Validator extends CustomValidator {
    constructor(fhirService: FhirService) { super(fhirService); }

    private getAllPages(implementationGuide: R4ImplementationGuide): ImplementationGuidePageComponent[] {
        const pages: ImplementationGuidePageComponent[] = [];

        function next(page: ImplementationGuidePageComponent) {
            pages.push(page);
            _.each(page.page, (nextPage) => next(nextPage));
        }

        if (implementationGuide.definition.page) {
            next(implementationGuide.definition.page);
        }

        return pages;
    }

    public validateImplementationGuide(implementationGuide: R4ImplementationGuide): ValidatorMessage[] {
        if (!implementationGuide.definition) {
            return [];
        }

        const messages = [];
        const allResources = implementationGuide.definition.resource;
        const groupedResources = _.groupBy(allResources, (resource: ImplementationGuideResourceComponent) => resource.reference ? resource.reference.reference : null);
        const allPages = this.getAllPages(implementationGuide);
        const groupedPageTitles = _.groupBy(allPages, (page: ImplementationGuidePageComponent) => page.title);
        const allProfileTypes = this.fhirService.profileTypes.concat(this.fhirService.terminologyTypes);

        _.each(allResources, (resource: ImplementationGuideResourceComponent, index) => {
            if (!resource.reference || !resource.reference.reference) {
                messages.push({
                    location: 'ImplementationGuide.definition.resource',
                    resourceId: implementationGuide.id,
                    severity: 'warning',
                    message: `Resource #${index + 1} does not have a reference`
                });
            } else {
                const parsedReference = this.fhirService.parseReference(resource.reference.reference);

                if (resource.exampleBoolean || resource.exampleCanonical) {
                    if (allProfileTypes.indexOf(parsedReference.resourceType) >= 0) {
                        messages.push({
                            location: 'ImplementationGuide.definition.resource',
                            resourceId: implementationGuide.id,
                            severity: 'warning',
                            message: `Resource with reference ${resource.reference.reference} may incorrectly be flagged as an example`
                        });
                    }
                } else {
                    if (allProfileTypes.indexOf(parsedReference.resourceType) < 0) {
                        messages.push({
                            location: 'ImplementationGuide.definition.resource',
                            resourceId: implementationGuide.id,
                            severity: 'warning',
                            message: `Resource with reference ${resource.reference.reference} should be flagged as an example`
                        });
                    }
                }
            }
        });

        _.each(groupedResources, (resourceGroup, reference) => {
            if (resourceGroup.length > 1) {
                messages.push({
                    location: 'ImplementationGuide.definition.resource',
                    resourceId: implementationGuide.id,
                    severity: 'warning',
                    message: `Multiple resources found with reference ${reference || '""'}`
                });
            }
        });

        _.each(groupedPageTitles, (pages, title) => {
            if (!title && pages.length > 0) {
                messages.push({
                    location: 'ImplementationGuide.definition.page+',
                    resourceId: implementationGuide.id,
                    severity: 'warning',
                    message: `One or more pages does not have a title. It will not be exported.`
                });
            }

            if (title && pages.length > 1) {
                messages.push({
                    location: 'ImplementationGuide.definition.page+',
                    resourceId: implementationGuide.id,
                    severity: 'warning',
                    message: `Multiple pages found with the same title ${title || '""'}`
                });
            }
        });

        _.each(allPages, (page: ImplementationGuidePageComponent) => {
            if (!page.nameReference || !page.nameReference.reference) {
                messages.push({
                    location: 'ImplementationGuide.definition.page+',
                    resourceId: implementationGuide.id,
                    severity: 'warning',
                    message: `Page with title ${page.title} does not specify a reference to the content of the page`
                });
            } else if (!page.nameReference.reference.startsWith('#')) {
                messages.push({
                    location: 'ImplementationGuide.definition.page+',
                    resourceId: implementationGuide.id,
                    severity: 'warning',
                    message: `The reference for the page with the title ${page.title} should be a Binary resource contained within the ImplementationGuide so that ToF knows how to export it`
                });
            }
        });

        return messages;
    }
}