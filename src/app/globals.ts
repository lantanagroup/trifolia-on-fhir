import {Injectable} from '@angular/core';
import {Coding} from './models/stu3/fhir';
import * as _ from 'underscore';
import {FhirVersion} from './models/fhir-version';

@Injectable()
export class Globals {
    public pageAsContainedBinary = false;

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
        recentCodeSystems: 'recentCodeSystems'
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
        'resource.id': 'The logical id of the resource, as used in the URL for the resource. Once assigned, this value never changes.',
        'sd.name': 'A natural language name identifying the structure definition. This name should be usable as an identifier for the module by machine processing applications such as code generation.',
        'sd.url': 'An absolute URI that is used to identify this structure definition when it is referenced in a specification, model, design or an instance; also called its canonical identifier. This SHOULD be globally unique and SHOULD be a literal address at which this structure definition is (or will be) published.',
        'sd.title': 'A short, descriptive, user-friendly title for the structure definition.',
        'sd.date': 'The date (and optionally time) when the structure definition was published. The date must change when the business version changes and it must change if the status code changes. In addition, it should change when the substantive content of the structure definition changes.',
        'sd.publisher': 'The name of the organization or individual that published the structure definition.',
        'sd.description': 'A free text natural language description of the structure definition from a consumer\'s perspective.',
        'sd.version': 'The identifier that is used to identify this version of the structure definition when it is referenced in a specification, model, design or instance. This is an arbitrary value managed by the structure definition author and is not expected to be globally unique. For example, it might be a timestamp (e.g. yyyymmdd) if a managed version is not available. There is also no expectation that versions can be placed in a lexicographical sequence.',
        'sd.status': 'The status of this structure definition. Enables tracking the life-cycle of the content.',
        'sd.experimental': 'A Boolean value to indicate that this structure definition is authored for testing purposes (or education/evaluation/marketing) and is not intended to be used for genuine usage.',
        'ed.representation': 'Codes that define how this element is ' +
            'represented in instances, when the deviation varies from the normal case.',
        'ed.code': 'A code that has the same meaning as the element in a particular terminology.',
        'ed.min': 'The minimum number of times this element SHALL appear in the instance.',
        'ed.max': 'The maximum number of times this element is permitted to appear in the instance.',
        'ed.type': 'The data type or resource that the value of this element is permitted to be.',
        'ed.type.code': 'URL of Data type or Resource that is a(or the) type used for this element. References are URLs that are relative to http://hl7.org/fhir/StructureDefinition e.g. "string" is a reference to http://hl7.org/fhir/StructureDefinition/string. Absolute URLs are only allowed in logical models.',
        'ed.type.profile': 'Identifies a profile structure or implementation Guide that applies to the datatype this element refers to. If any profiles are specified, then the content must conform to at least one of them. The URL can be a local reference - to a contained StructureDefinition, or a reference to another StructureDefinition or Implementation Guide by a canonical URL. When an implementation guide is specified, the type SHALL conform to at least one profile defined in the implementation guide.',
        'ed.type.targetProfile': 'Used when the type is "Reference", and Identifies a profile structure or implementation Guide that applies to the target of the reference this element refers to. If any profiles are specified, then the content must conform to at least one of them. The URL can be a local reference - to a contained StructureDefinition, or a reference to another StructureDefinition or Implementation Guide by a canonical URL. When an implementation guide is specified, the target resource SHALL conform to at least one profile defined in the implementation guide.',
        'ed.type.aggregation': 'If the type is a reference to another resource, how the resource is or can be aggregated - is it a contained resource, or a reference, and if the context is a bundle, is it included in the bundle.',
        'ed.type.versioning': 'Whether this reference needs to be version specific or version independent, or whether either can be used.',
        'ed.contentReference': 'Identifies the identity of an element defined elsewhere in the profile whose content rules should be applied to the current element.'
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

    public promptForRemove(array: any[], index: number, message = 'Are you sure you want to remove this item?') {
        if (confirm(message)) {
            array.splice(index, 1);
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
