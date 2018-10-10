import {Injectable} from '@angular/core';
import {Coding} from './models/stu3/fhir';
import * as _ from 'underscore';
import {FhirVersion} from './models/fhir-version';

@Injectable()
export class Globals {
    // Indicates if in the Implementation Guide Edit screen, page Binary resources should be considered a contained resource
    public pageAsContainedBinary = true;
    public readonly extensionIgPageContentUrl = 'https://trifolia-on-fhir.lantanagroup.com/StructureDefinition/extension-ig-page-content';
    public readonly extensionIgPageAutoGenerateToc = 'https://trifolia-on-fhir.lantanagroup.com/StructureDefinition/extension-ig-page-auto-generate-toc';

    static getChoiceSelectionName(obj: any, propertyName: string, choices?: Coding[]): string {
        const keys = Object.keys(obj);

        if (choices) {
            const foundProperties = _.filter(keys, (key: string) => {
                const foundChoice = _.find(choices, (choice: Coding) => {
                    return choice.code === propertyName + key;
                });
                return !!foundChoice;
            });

            if (foundProperties.length > 0) {
                return foundProperties[0];
            } else {
                return;
            }
        }

        const foundProperties = _.filter(keys, (key: string) => key.startsWith(propertyName));

        if (foundProperties.length > 0) {
            return foundProperties[0];
        } else {
            return;
        }
    }

    static hasChoiceSelection(obj: any, propertyName: string, choices?: Coding[]): boolean {
        const choiceName = Globals.getChoiceSelectionName(obj, propertyName, choices);
        return !!choiceName;
    }

    public readonly cookieKeys = {
        recentImplementationGuides: 'recentImplementationGuides',
        recentStructureDefinitions: 'recentStructureDefinitions',
        recentCapabilityStatements: 'recentCapabilityStatements',
        recentOperationDefinitions: 'recentOperationDefinitions',
        recentValueSets: 'recentValueSets',
        recentCodeSystems: 'recentCodeSystems',
        recentQuestionnaires: 'recentQuestionnaires'
    };

    public readonly FHIRUrls = {
        ImplementationGuide: 'http://hl7.org/fhir/StructureDefinition/ImplementationGuide',
        StructureDefinition: 'http://hl7.org/fhir/StructureDefinition/StructureDefinition'
    };

    public readonly designationUseCodes: Coding[] = [
        { code: '900000000000003001', display: 'Fully specified name', system: 'http://snomed.info/sct' },
        { code: '900000000000013009', display: 'Synonym', system: 'http://snomed.info/sct' },
        { code: '900000000000550004', display: 'Definition', system: 'http://snomed.info/sct' }
    ];

    public readonly codeSystemHierarchyMeaningCodes: Coding[] = [
        { code: 'grouped-by', display: 'Grouped By', system: 'http://hl7.org/fhir/codesystem-hierarchy-meaning' },
        { code: 'is-a', display: 'Is-A', system: 'http://hl7.org/fhir/codesystem-hierarchy-meaning' },
        { code: 'part-of', display: 'Part Of', system: 'http://hl7.org/fhir/codesystem-hierarchy-meaning' },
        { code: 'classified-with', display: 'Classified With', system: 'http://hl7.org/fhir/codesystem-hierarchy-meaning' }
    ];

    public readonly mimeTypeCodes: Coding[] = [
        { code: 'application/json', display: 'JSON', system: 'http://www.rfc-editor.org/bcp/bcp13.txt' },
        { code: 'application/fhir+json', display: 'FHIR JSON', system: 'http://www.rfc-editor.org/bcp/bcp13.txt' },
        { code: 'application/xml', display: 'XML', system: 'http://www.rfc-editor.org/bcp/bcp13.txt' },
        { code: 'application/fhir+xml', display: 'FHIR XML', system: 'http://www.rfc-editor.org/bcp/bcp13.txt' },
        { code: 'text/xml', display: 'Text XML', system: 'http://www.rfc-editor.org/bcp/bcp13.txt' },
        { code: 'text/plain', display: 'Plain Text', system: 'http://www.rfc-editor.org/bcp/bcp13.txt' },
        { code: 'text/css', display: 'CSS', system: 'http://www.rfc-editor.org/bcp/bcp13.txt' },
        { code: 'image/png', display: 'PNG', system: 'http://www.rfc-editor.org/bcp/bcp13.txt' },
        { code: 'image/jpeg', display: 'JPEG', system: 'http://www.rfc-editor.org/bcp/bcp13.txt' },
        { code: 'application/pdf', display: 'PDF', system: 'http://www.rfc-editor.org/bcp/bcp13.txt' },
        { code: 'application/octet-stream', display: 'Octet Stream', system: 'http://www.rfc-editor.org/bcp/bcp13.txt' }
    ];

    public readonly dataTypes = [
        'instant',
        'time',
        'date',
        'dateTime',
        'decimal',
        'integer',
        'unsignedInt',
        'base64Binary',
        'string',
        'positiveInt',
        'code',
        'id',
        'oid',
        'uri',
        'boolean',
        'markdown',
        'Ratio',
        'Period',
        'Range',
        'Attachment',
        'Identifier',
        'HumanName',
        'Annotation',
        'Address',
        'ContactPoint',
        'SampledData',
        'Money',
        'Count',
        'Duration',
        'SimpleQuantity',
        'Quantity',
        'Distance',
        'Age',
        'CodeableConcept',
        'Signature',
        'Coding',
        'Timing'
    ];

    public tooltips = {
        'implementationguide.description': 'An implementation guide (IG) is a set of rules about how FHIR resources are used (or should be used) to solve a particular problem, with associated documentation to support and clarify the usage. Classically, FHIR implementation guides are published on the web after they are generated using the FHIR Implementation Guide Publisher.\nThe ImplementationGuide resource is a single resource that defines the logical content of the IG, along with the important entry pages into the publication, so that the logical package that the IG represents, so that the contents are computable.\nIn particular, validators are able to use the ImplementationGuide resource to validate content against the implementation guide as a whole. The significant conformance expectation introduced by the ImplementationGuide resource is the idea of Default Profiles. Implementations may conform to multiple implementation guides at once, but this requires that the implementation guides are compatible.',
        'structuredefinition.description': 'A definition of a FHIR structure. This resource is used to describe the underlying resources, data types defined in FHIR, and also for describing extensions and constraints on resources and data types.\nThe StructureDefinition resource describes a structure - a set of data element definitions, and their associated rules of usage. These structure definitions are used to describe both the content defined in the FHIR specification itself - Resources, data types, the underlying infrastructural types, and also are used to describe how these structures are used in implementations. This allows the definitions of the structures to be shared and published through repositories of structure definitions, compared with each other, and used as the basis for code, report and UI generation.',
        'operationdefinition.description': 'A formal computable definition of an operation (on the RESTful interface) or a named query (using the search interaction).\nOperationDefinitions are published to define operations that servers can implement in a common fashion. The FHIR specification itself describes some (see below), and other organizations (including IHE, national programs, jurisdictions and vendors) are able to publish additional OperationDefinitions.',
        'capabilitystatement.description': 'A Capability Statement documents a set of capabilities (behaviors) of a FHIR Server that may be used as a statement of actual server functionality or a statement of required or desired server implementation.\nThe capability statement is a key part of the overall conformance framework in FHIR. It is used as a statement of the features of actual software, or of a set of rules for an application to provide. This statement connects to all the detailed statements of functionality, such as StructureDefinitions and ValueSets. This composite statement of application capability may be used for system compatibility testing, code generation, or as the basis for a conformance assessment.',
        'valueset.description': 'A ValueSet resource instances specifies a set of codes drawn from one or more code systems, intended for use in a particular context. Value sets link between [[[CodeSystem]]] definitions and their use in [coded elements](terminologies.html).\nWhen using value sets, proper differentiation between a code system and a value set is important. This is one very common area where significant clinical safety risks occur in practice.',
        'codesystem.description': 'The CodeSystem resource is used to declare the existence of and describe a code system or code system supplement and its key properties, and optionally define a part or all of its content.\nCode systems define which codes (symbols and/or expressions) exist, and how they are understood. Value sets select a set of codes from one or more code systems to specify which codes can be used in a particular context.\nThe CodeSystem resource may list some or all of the concepts in the code system, along with their basic properties (code, display, definition), designations, and additional properties. Code System resources may also be used to define supplements, that extend an existing code system with additional designations and properties.',
        'questionnaire.description': 'A structured set of questions intended to guide the collection of answers from end-users. Questionnaires provide detailed control over order, presentation, phraseology and grouping to allow coherent, consistent data collection.\nA Questionnaire is an organized collection of questions intended to solicit information from patients, providers or other individuals involved in the healthcare domain. They may be simple flat lists of questions or can be hierarchically organized in groups and sub-groups, each containing questions. The Questionnaire defines the questions to be asked, how they are ordered and grouped, any intervening instructional text and what the constraints are on the allowed answers. The results of a Questionnaire can be communicated using the QuestionnaireResponse resource.',
        'ed.type.targetProfile': 'Profile (StructureDefinition) to apply to reference target (or IG). This field is a URI, and should be the StructureDefinition.url of the target profile. This is used to indicate that this type (typically a Reference) should be validated against the selected target profile',
        'ed.type.profile': 'Profile (StructureDefinition) to apply (or IG). This field is a URL, and should be the StructureDefinition.url of the profile selected'
    };

    public hasChoiceSelection(obj: any, propertyName: string, choices?: Coding[]) {
        return Globals.hasChoiceSelection(obj, propertyName, choices);
    }

    public parseFhirUrl(url: string) {
        const regex = /((http|https):\/\/([A-Za-z0-9\\\.\:\%\$]\/)*\/)?(Account|ActivityDefinition|AdverseEvent|AllergyIntolerance|Appointment|AppointmentResponse|AuditEvent|Basic|Binary|BodySite|Bundle|CapabilityStatement|CarePlan|CareTeam|ChargeItem|Claim|ClaimResponse|ClinicalImpression|CodeSystem|Communication|CommunicationRequest|CompartmentDefinition|Composition|ConceptMap|Condition|Consent|Contract|Coverage|DataElement|DetectedIssue|Device|DeviceComponent|DeviceMetric|DeviceRequest|DeviceUseStatement|DiagnosticReport|DocumentManifest|DocumentReference|EligibilityRequest|EligibilityResponse|Encounter|Endpoint|EnrollmentRequest|EnrollmentResponse|EpisodeOfCare|ExpansionProfile|ExplanationOfBenefit|FamilyMemberHistory|Flag|Goal|GraphDefinition|Group|GuidanceResponse|HealthcareService|ImagingManifest|ImagingStudy|Immunization|ImmunizationRecommendation|ImplementationGuide|Library|Linkage|List|Location|Measure|MeasureReport|Media|Medication|MedicationAdministration|MedicationDispense|MedicationRequest|MedicationStatement|MessageDefinition|MessageHeader|NamingSystem|NutritionOrder|Observation|OperationDefinition|OperationOutcome|Organization|Patient|PaymentNotice|PaymentReconciliation|Person|PlanDefinition|Practitioner|PractitionerRole|Procedure|ProcedureRequest|ProcessRequest|ProcessResponse|Provenance|Questionnaire|QuestionnaireResponse|ReferralRequest|RelatedPerson|RequestGroup|ResearchStudy|ResearchSubject|RiskAssessment|Schedule|SearchParameter|Sequence|ServiceDefinition|Slot|Specimen|StructureDefinition|StructureMap|Subscription|Substance|SupplyDelivery|SupplyRequest|Task|TestReport|TestScript|ValueSet|VisionPrescription)(\/([A-Za-z0-9\-\.]+))?(\/_history\/([A-Za-z0-9\-\.]{1,64}))?/g;
        const match = regex.exec(url);

        if (match) {
            return {
                resourceType: match[4],
                id: match[6],
                historyId: match[8]
            };
        }
    }

    public generateRandomNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    public toggleProperty(parent, propertyName, defaultValue, callback?: any, caller?: any) {
        if (parent.hasOwnProperty(propertyName)) {
            delete parent[propertyName];
        } else {
            parent[propertyName] = defaultValue;

            if (callback) {
                if (caller) {
                    callback.call(caller);
                } else {
                    callback();
                }
            }
        }
    }

    public getChoiceProperty(parent, propertyName, choices) {
        let foundChoice;

        if (propertyName.lastIndexOf('[x]') === propertyName.length - 4) {
            propertyName = propertyName.substring(0, propertyName.length - 4);
        }

        for (let i = 0; i < choices.length; i++) {
            const choice = choices[i].substring(0, 1).toUpperCase() + choices[i].substring(1);
            if (parent.hasOwnProperty(propertyName + choice)) {
                foundChoice = choice;
            }
        }

        return foundChoice;
    }

    public toggleChoiceProperty(parent, property, choices, defaultValue) {
        const foundChoice = this.getChoiceProperty(parent, property, choices);

        if (foundChoice) {
            delete parent[property + foundChoice];
        } else {
            const defaultChoice = choices[0].substring(0, 1).toUpperCase() + choices[0].substring(1);
            parent[property + defaultChoice] = defaultValue;
        }
    }

    public getShortString(theString: string, pre: boolean = true, length: number = 20): string {
        if (theString && theString.length > length) {
            if (pre) {
                return theString.substring(0, length) + '...';
            } else {
                return '...' + theString.substring(theString.length - length);
            }
        }

        return theString;
    }

    public promptForRemove(array: any[], index: number, message = 'Are you sure you want to remove this item?', event = null) {
        if (confirm(message)) {
            array.splice(index, 1);
            event.preventDefault();
        }
    }

    /**
     * Returns a code from the options that matches the code
     * For use within select/drop-downs when it has to match an object in the options by reference
     * @param {Coding} code
     * @param {Coding[]} options
     * @param {boolean} matchSystem Whether to match based on the system
     * @param {boolean} matchCode Whether to match based on the code
     * @returns {any}
     */
    public getSelectCoding(code: Coding, options: Coding[], matchSystem = true, matchCode = true) {
        if (!matchSystem && !matchCode) {
            throw new Error('At least one of matchSystem or matchCode must be true');
        }

        return _.find(options, (next) => {
            const isSystemMatch = !matchSystem || code.system === next.system;
            const isCodeMatch = !matchCode || code.code === next.code;
            return isSystemMatch && isCodeMatch;
        });
    }

    public trackByFn(index, item) {
        return index; // or item.id
    }

    public parseFhirVersion(fhirVersion: string): FhirVersion {
        const fhirVersionRegex = /^(\d+)\.(\d+)\.(\d+)$/g;
        const versionMatch = fhirVersionRegex.exec(fhirVersion);

        if (versionMatch) {
            const parsedVersion: FhirVersion = {
                major: parseInt(versionMatch[1]),
                minor: parseInt(versionMatch[2]),
                patch: parseInt(versionMatch[3])
            };
            return parsedVersion;
        }
    }

    public getErrorMessage(err: any): string {
        if (err && err.message) {
            return err.message;
        } else if (typeof err === 'string') {
            return err;
        }

        return 'An unspecified error occurred';
    }
}
