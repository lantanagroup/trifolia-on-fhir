import {Injectable} from '@angular/core';
import {Coding} from './models/fhir';
import * as _ from 'underscore';

@Injectable()
export class Globals {
    public pageAsContainedBinary = false;

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

    public readonly commonLanguageCodes: Coding[] = [
        { code: 'ar', display: 'Arabic', system: 'urn:ietf:bcp:47' },
        { code: 'bn', display: 'Bengali', system: 'urn:ietf:bcp:47' },
        { code: 'cs', display: 'Czech', system: 'urn:ietf:bcp:47' },
        { code: 'da', display: 'Danish', system: 'urn:ietf:bcp:47' },
        { code: 'de', display: 'German', system: 'urn:ietf:bcp:47' },
        { code: 'de-AT', display: 'German (Austria)', system: 'urn:ietf:bcp:47' },
        { code: 'de-CH', display: 'German (Switzerland)', system: 'urn:ietf:bcp:47' },
        { code: 'de-DE', display: 'German (Germany)', system: 'urn:ietf:bcp:47' },
        { code: 'el', display: 'Greek', system: 'urn:ietf:bcp:47' },
        { code: 'en', display: 'English', system: 'urn:ietf:bcp:47' },
        { code: 'en-AU', display: 'English (Australia)', system: 'urn:ietf:bcp:47' },
        { code: 'en-CA', display: 'English (Canada)', system: 'urn:ietf:bcp:47' },
        { code: 'en-GB', display: 'English (Great Britain)', system: 'urn:ietf:bcp:47' },
        { code: 'en-IN', display: 'English (India)', system: 'urn:ietf:bcp:47' },
        { code: 'en-NZ', display: 'English (New Zeland)', system: 'urn:ietf:bcp:47' },
        { code: 'en-SG', display: 'English (Singapore)', system: 'urn:ietf:bcp:47' },
        { code: 'en-US', display: 'English (United States)', system: 'urn:ietf:bcp:47' },
        { code: 'es', display: 'Spanish', system: 'urn:ietf:bcp:47' },
        { code: 'es-AR', display: 'Spanish (Argentina)', system: 'urn:ietf:bcp:47' },
        { code: 'es-ES', display: 'Spanish (Spain)', system: 'urn:ietf:bcp:47' },
        { code: 'es-UY', display: 'Spanish (Uruguay)', system: 'urn:ietf:bcp:47' },
        { code: 'fi', display: 'Finnish', system: 'urn:ietf:bcp:47' },
        { code: 'fr', display: 'French', system: 'urn:ietf:bcp:47' },
        { code: 'fr-BE', display: 'French (Belgium)', system: 'urn:ietf:bcp:47' },
        { code: 'fr-CH', display: 'French (Switzerland)', system: 'urn:ietf:bcp:47' },
        { code: 'fr-FR', display: 'French (France)', system: 'urn:ietf:bcp:47' },
        { code: 'fy', display: 'Frysian', system: 'urn:ietf:bcp:47' },
        { code: 'fy-NL', display: 'Frysian (Netherlands)', system: 'urn:ietf:bcp:47' },
        { code: 'hi', display: 'Hindi', system: 'urn:ietf:bcp:47' },
        { code: 'hr', display: 'Croatian', system: 'urn:ietf:bcp:47' },
        { code: 'it', display: 'Italian', system: 'urn:ietf:bcp:47' },
        { code: 'it-CH', display: 'Italian (Switzerland)', system: 'urn:ietf:bcp:47' },
        { code: 'it-IT', display: 'Italian (Italy)', system: 'urn:ietf:bcp:47' },
        { code: 'ja', display: 'Japanese', system: 'urn:ietf:bcp:47' },
        { code: 'ko', display: 'Korean', system: 'urn:ietf:bcp:47' },
        { code: 'nl', display: 'Dutch', system: 'urn:ietf:bcp:47' },
        { code: 'nl-BE', display: 'Dutch (Belgium)', system: 'urn:ietf:bcp:47' },
        { code: 'nl-NL', display: 'Dutch (Netherlands)', system: 'urn:ietf:bcp:47' },
        { code: 'no', display: 'Norwegian', system: 'urn:ietf:bcp:47' },
        { code: 'no-NO', display: 'Norwegian (Norway)', system: 'urn:ietf:bcp:47' },
        { code: 'pa', display: 'Punjabi', system: 'urn:ietf:bcp:47' },
        { code: 'pt', display: 'Portuguese', system: 'urn:ietf:bcp:47' },
        { code: 'pt-BR', display: 'Portuguese (Brazil)', system: 'urn:ietf:bcp:47' },
        { code: 'ru', display: 'Russian', system: 'urn:ietf:bcp:47' },
        { code: 'ru-RU', display: 'Russian (Russia)', system: 'urn:ietf:bcp:47' },
        { code: 'sr', display: 'Serbian', system: 'urn:ietf:bcp:47' },
        { code: 'sr-SP', display: 'Serbian (Serbia)', system: 'urn:ietf:bcp:47' },
        { code: 'sv', display: 'Swedish', system: 'urn:ietf:bcp:47' },
        { code: 'sv-SE', display: 'Swedish (Sweden)', system: 'urn:ietf:bcp:47' },
        { code: 'te', display: 'Telegu', system: 'urn:ietf:bcp:47' },
        { code: 'zh', display: 'Chinese', system: 'urn:ietf:bcp:47' },
        { code: 'zh-CN', display: 'Chinese (China)', system: 'urn:ietf:bcp:47' },
        { code: 'zh-HK', display: 'Chinese (Hong Kong)', system: 'urn:ietf:bcp:47' },
        { code: 'zh-SG', display: 'Chinese (Singapore)', system: 'urn:ietf:bcp:47' },
        { code: 'zh-TW', display: 'Chinese (Taiwan)', system: 'urn:ietf:bcp:47' }
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

    public readonly addressUseCodes: Coding[] = [
        { code: 'home', display: 'Home', system: 'http://hl7.org/fhir/address-use' },
        { code: 'work', display: 'Work', system: 'http://hl7.org/fhir/address-use' },
        { code: 'temp', display: 'Temporary', system: 'http://hl7.org/fhir/address-use' },
        { code: 'old', display: 'Old / Incorrect', system: 'http://hl7.org/fhir/address-use' }
    ];

    public readonly addressTypeCodes: Coding[] = [
        { code: 'postal', display: 'Postal', system: 'http://hl7.org/fhir/address-type' },
        { code: 'physical', display: 'Physical', system: 'http://hl7.org/fhir/address-type' },
        { code: 'both', display: 'Postal & Physical', system: 'http://hl7.org/fhir/address-type' }
    ];

    public readonly disciminatorTypeCodes: Coding[] = [
        { code: 'value', display: 'Value', system: 'http://hl7.org/fhir/discriminator-type' },
        { code: 'exists', display: 'Exists', system: 'http://hl7.org/fhir/discriminator-type' },
        { code: 'pattern', display: 'Pattern', system: 'http://hl7.org/fhir/discriminator-type' },
        { code: 'type', display: 'Type', system: 'http://hl7.org/fhir/discriminator-type' },
        { code: 'profile', display: 'Profile', system: 'http://hl7.org/fhir/discriminator-type' }
    ];

    public readonly slicingRulesCodes: Coding[] = [
        { code: 'closed', display: 'Closed', system: 'http://hl7.org/fhir/resource-slicing-rules' },
        { code: 'open', display: 'Open', system: 'http://hl7.org/fhir/resource-slicing-rules' },
        { code: 'openAtEnd', display: 'Open at End', system: 'http://hl7.org/fhir/resource-slicing-rules' }
    ];

    public readonly bindingStrengthCodes: Coding[] = [
        { code: 'required', display: 'Required', system: 'http://hl7.org/fhir/binding-strength' },
        { code: 'extensible', display: 'Extensible', system: 'http://hl7.org/fhir/binding-strength' },
        { code: 'preferred', display: 'Preferred', system: 'http://hl7.org/fhir/binding-strength' },
        { code: 'example', display: 'Example', system: 'http://hl7.org/fhir/binding-strength' }
    ];

    public readonly publicationStatusCodes: Coding[] = [
        { code: 'draft', display: 'Draft', system: 'http://hl7.org/fhir/publication-status' },
        { code: 'active', display: 'Active', system: 'http://hl7.org/fhir/publication-status' },
        { code: 'retired', display: 'Retired', system: 'http://hl7.org/fhir/publication-status' },
        { code: 'unknown', display: 'Unknown', system: 'http://hl7.org/fhir/publication-status' }
    ];

    public readonly structureDefinitionKindCodes: Coding[] = [
        { code: 'primitive-type', display: 'Primitive Data Type', system: 'http://hl7.org/fhir/structure-definition-kind' },
        { code: 'complex-type', display: 'Complex Data Type', system: 'http://hl7.org/fhir/structure-definition-kind' },
        { code: 'resource', display: 'Resource', system: 'http://hl7.org/fhir/structure-definition-kind' },
        { code: 'logical', display: 'Logical Model', system: 'http://hl7.org/fhir/structure-definition-kind' }
    ];

    public readonly extensionContextCodes: Coding[] = [
        { code: 'resource', display: 'Resource', system: 'http://hl7.org/fhir/extension-context' },
        { code: 'datatype', display: 'Datatype', system: 'http://hl7.org/fhir/extension-context' },
        { code: 'extension', display: 'Extension', system: 'http://hl7.org/fhir/extension-context' }
    ];

    public readonly useContextCodes: Coding[] = [
        {code: 'gender', display: 'Gender', system: 'http://hl7.org/fhir/usage-context-type'},
        {code: 'age', display: 'Age Range', system: 'http://hl7.org/fhir/usage-context-type'},
        {code: 'focus', display: 'Clinical Focus', system: 'http://hl7.org/fhir/usage-context-type'},
        {code: 'user', display: 'User Type', system: 'http://hl7.org/fhir/usage-context-type'},
        {code: 'workflow', display: 'Workflow Setting', system: 'http://hl7.org/fhir/usage-context-type'},
        {code: 'task', display: 'Workflow Task', system: 'http://hl7.org/fhir/usage-context-type'},
        {code: 'venue', display: 'Clinical Venue', system: 'http://hl7.org/fhir/usage-context-type'},
        {code: 'species', display: 'Species', system: 'http://hl7.org/fhir/usage-context-type'}
    ];

    public readonly typeDerivationRuleCodes: Coding[] = [
        {code: 'specialization', display: 'Specialization', system: 'http://hl7.org/fhir/type-derivation-rule'},
        {code: 'constraint', display: 'Constraint', system: 'http://hl7.org/fhir/type-derivation-rule'}
    ];

    public readonly contactPointSystemCodes: Coding[] = [
        {code: 'phone', display: 'Phone', system: 'http://hl7.org/fhir/contact-point-system'},
        {code: 'fax', display: 'Fax', system: 'http://hl7.org/fhir/contact-point-system'},
        {code: 'email', display: 'Email', system: 'http://hl7.org/fhir/contact-point-system'},
        {code: 'pager', display: 'Pager', system: 'http://hl7.org/fhir/contact-point-system'},
        {code: 'url', display: 'URL', system: 'http://hl7.org/fhir/contact-point-system'},
        {code: 'sms', display: 'SMS', system: 'http://hl7.org/fhir/contact-point-system'},
        {code: 'other', display: 'Other', system: 'http://hl7.org/fhir/contact-point-system'}
    ];

    public readonly identifierUseCodes: Coding[] = [
        {code: 'usual', display: 'Usual', system: 'http://hl7.org/fhir/identifier-use'},
        {code: 'official', display: 'Official', system: 'http://hl7.org/fhir/identifier-use'},
        {code: 'temp', display: 'Temp', system: 'http://hl7.org/fhir/identifier-use'},
        {code: 'secondary', display: 'Secondary', system: 'http://hl7.org/fhir/identifier-use'}
    ];

    public readonly identifierTypeCodes: Coding[] = [
        { code: 'DL', display: 'Driver\'s license number', system: 'http://hl7.org/fhir/v2/0203' },
        { code: 'PPN', display: 'Passport number', system: 'http://hl7.org/fhir/v2/0203' },
        { code: 'BRN', display: 'Breed Registry Number', system: 'http://hl7.org/fhir/v2/0203' },
        { code: 'MR', display: 'Medical record number', system: 'http://hl7.org/fhir/v2/0203' },
        { code: 'MCN', display: 'Microchip Number', system: 'http://hl7.org/fhir/v2/0203' },
        { code: 'EN', display: 'Employer number', system: 'http://hl7.org/fhir/v2/0203' },
        { code: 'TAX', display: 'Tax ID number', system: 'http://hl7.org/fhir/v2/0203' },
        { code: 'NIIP', display: 'National Insurance Payor Identifier (Payor)', system: 'http://hl7.org/fhir/v2/0203' },
        { code: 'PRN', display: 'Provider number', system: 'http://hl7.org/fhir/v2/0203' },
        { code: 'MD', display: 'Medical License number', system: 'http://hl7.org/fhir/v2/0203' },
        { code: 'DR', display: 'Donor Registration Number', system: 'http://hl7.org/fhir/v2/0203' },
        { code: 'ACSN', display: 'Accession ID', system: 'http://hl7.org/fhir/v2/0203' },
        { code: 'UDI', display: 'Universal Device Identifier', system: 'http://hl7.org/fhir/identifier-type' },
        { code: 'SNO', display: 'Serial Number', system: 'http://hl7.org/fhir/identifier-type' },
        { code: 'SB', display: 'Social Beneficiary Identifier', system: 'http://hl7.org/fhir/identifier-type' },
        { code: 'PLAC', display: 'Placer Identifier', system: 'http://hl7.org/fhir/identifier-type' },
        { code: 'FILL', display: 'Filler Identifier', system: 'http://hl7.org/fhir/identifier-type' }
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

    public readonly resourceTypes = {
        'Account': { code: 'Account', display: 'Account' },
        'ActivityDefinition': { code: 'ActivityDefinition', display: 'ActivityDefinition' },
        'AdverseEvent': { code: 'AdverseEvent', display: 'AdverseEvent' },
        'AllergyIntolerance': { code: 'AllergyIntolerance', display: 'AllergyIntolerance' },
        'Appointment': { code: 'Appointment', display: 'Appointment' },
        'AppointmentResponse': { code: 'AppointmentResponse', display: 'AppointmentResponse' },
        'AuditEvent': { code: 'AuditEvent', display: 'AuditEvent' },
        'Basic': { code: 'Basic', display: 'Basic' },
        'Binary': { code: 'Binary', display: 'Binary' },
        'BodySite': { code: 'BodySite', display: 'BodySite' },
        'Bundle': { code: 'Bundle', display: 'Bundle' },
        'CapabilityStatement': { code: 'CapabilityStatement', display: 'CapabilityStatement' },
        'CarePlan': { code: 'CarePlan', display: 'CarePlan' },
        'CareTeam': { code: 'CareTeam', display: 'CareTeam' },
        'ChargeItem': { code: 'ChargeItem', display: 'ChargeItem' },
        'Claim': { code: 'Claim', display: 'Claim' },
        'ClaimResponse': { code: 'ClaimResponse', display: 'ClaimResponse' },
        'ClinicalImpression': { code: 'ClinicalImpression', display: 'ClinicalImpression' },
        'CodeSystem': { code: 'CodeSystem', display: 'CodeSystem' },
        'Communication': { code: 'Communication', display: 'Communication' },
        'CommunicationRequest': { code: 'CommunicationRequest', display: 'CommunicationRequest' },
        'CompartmentDefinition': { code: 'CompartmentDefinition', display: 'CompartmentDefinition' },
        'Composition': { code: 'Composition', display: 'Composition' },
        'ConceptMap': { code: 'ConceptMap', display: 'ConceptMap' },
        'Condition': { code: 'Condition', display: 'Condition' },
        'Consent': { code: 'Consent', display: 'Consent' },
        'Contract': { code: 'Contract', display: 'Contract' },
        'Coverage': { code: 'Coverage', display: 'Coverage' },
        'DataElement': { code: 'DataElement', display: 'DataElement' },
        'DetectedIssue': { code: 'DetectedIssue', display: 'DetectedIssue' },
        'Device': { code: 'Device', display: 'Device' },
        'DeviceComponent': { code: 'DeviceComponent', display: 'DeviceComponent' },
        'DeviceMetric': { code: 'DeviceMetric', display: 'DeviceMetric' },
        'DeviceRequest': { code: 'DeviceRequest', display: 'DeviceRequest' },
        'DeviceUseStatement': { code: 'DeviceUseStatement', display: 'DeviceUseStatement' },
        'DiagnosticReport': { code: 'DiagnosticReport', display: 'DiagnosticReport' },
        'DocumentManifest': { code: 'DocumentManifest', display: 'DocumentManifest' },
        'DocumentReference': { code: 'DocumentReference', display: 'DocumentReference' },
        'DomainResource': { code: 'DomainResource', display: 'DomainResource' },
        'EligibilityRequest': { code: 'EligibilityRequest', display: 'EligibilityRequest' },
        'EligibilityResponse': { code: 'EligibilityResponse', display: 'EligibilityResponse' },
        'Encounter': { code: 'Encounter', display: 'Encounter' },
        'Endpoint': { code: 'Endpoint', display: 'Endpoint' },
        'EnrollmentRequest': { code: 'EnrollmentRequest', display: 'EnrollmentRequest' },
        'EnrollmentResponse': { code: 'EnrollmentResponse', display: 'EnrollmentResponse' },
        'EpisodeOfCare': { code: 'EpisodeOfCare', display: 'EpisodeOfCare' },
        'ExpansionProfile': { code: 'ExpansionProfile', display: 'ExpansionProfile' },
        'ExplanationOfBenefit': { code: 'ExplanationOfBenefit', display: 'ExplanationOfBenefit' },
        'FamilyMemberHistory': { code: 'FamilyMemberHistory', display: 'FamilyMemberHistory' },
        'Flag': { code: 'Flag', display: 'Flag' },
        'Goal': { code: 'Goal', display: 'Goal' },
        'GraphDefinition': { code: 'GraphDefinition', display: 'GraphDefinition' },
        'Group': { code: 'Group', display: 'Group' },
        'GuidanceResponse': { code: 'GuidanceResponse', display: 'GuidanceResponse' },
        'HealthcareService': { code: 'HealthcareService', display: 'HealthcareService' },
        'ImagingManifest': { code: 'ImagingManifest', display: 'ImagingManifest' },
        'ImagingStudy': { code: 'ImagingStudy', display: 'ImagingStudy' },
        'Immunization': { code: 'Immunization', display: 'Immunization' },
        'ImmunizationRecommendation': { code: 'ImmunizationRecommendation', display: 'ImmunizationRecommendation' },
        'ImplementationGuide': { code: 'ImplementationGuide', display: 'ImplementationGuide' },
        'Library': { code: 'Library', display: 'Library' },
        'Linkage': { code: 'Linkage', display: 'Linkage' },
        'List': { code: 'List', display: 'List' },
        'Location': { code: 'Location', display: 'Location' },
        'Measure': { code: 'Measure', display: 'Measure' },
        'MeasureReport': { code: 'MeasureReport', display: 'MeasureReport' },
        'Media': { code: 'Media', display: 'Media' },
        'Medication': { code: 'Medication', display: 'Medication' },
        'MedicationAdministration': { code: 'MedicationAdministration', display: 'MedicationAdministration' },
        'MedicationDispense': { code: 'MedicationDispense', display: 'MedicationDispense' },
        'MedicationRequest': { code: 'MedicationRequest', display: 'MedicationRequest' },
        'MedicationStatement': { code: 'MedicationStatement', display: 'MedicationStatement' },
        'MessageDefinition': { code: 'MessageDefinition', display: 'MessageDefinition' },
        'MessageHeader': { code: 'MessageHeader', display: 'MessageHeader' },
        'NamingSystem': { code: 'NamingSystem', display: 'NamingSystem' },
        'NutritionOrder': { code: 'NutritionOrder', display: 'NutritionOrder' },
        'Observation': { code: 'Observation', display: 'Observation' },
        'OperationDefinition': { code: 'OperationDefinition', display: 'OperationDefinition' },
        'OperationOutcome': { code: 'OperationOutcome', display: 'OperationOutcome' },
        'Organization': { code: 'Organization', display: 'Organization' },
        'Parameters': { code: 'Parameters', display: 'Parameters' },
        'Patient': { code: 'Patient', display: 'Patient' },
        'PaymentNotice': { code: 'PaymentNotice', display: 'PaymentNotice' },
        'PaymentReconciliation': { code: 'PaymentReconciliation', display: 'PaymentReconciliation' },
        'Person': { code: 'Person', display: 'Person' },
        'PlanDefinition': { code: 'PlanDefinition', display: 'PlanDefinition' },
        'Practitioner': { code: 'Practitioner', display: 'Practitioner' },
        'PractitionerRole': { code: 'PractitionerRole', display: 'PractitionerRole' },
        'Procedure': { code: 'Procedure', display: 'Procedure' },
        'ProcedureRequest': { code: 'ProcedureRequest', display: 'ProcedureRequest' },
        'ProcessRequest': { code: 'ProcessRequest', display: 'ProcessRequest' },
        'ProcessResponse': { code: 'ProcessResponse', display: 'ProcessResponse' },
        'Provenance': { code: 'Provenance', display: 'Provenance' },
        'Questionnaire': { code: 'Questionnaire', display: 'Questionnaire' },
        'QuestionnaireResponse': { code: 'QuestionnaireResponse', display: 'QuestionnaireResponse' },
        'ReferralRequest': { code: 'ReferralRequest', display: 'ReferralRequest' },
        'RelatedPerson': { code: 'RelatedPerson', display: 'RelatedPerson' },
        'RequestGroup': { code: 'RequestGroup', display: 'RequestGroup' },
        'ResearchStudy': { code: 'ResearchStudy', display: 'ResearchStudy' },
        'ResearchSubject': { code: 'ResearchSubject', display: 'ResearchSubject' },
        'Resource': { code: 'Resource', display: 'Resource' },
        'RiskAssessment': { code: 'RiskAssessment', display: 'RiskAssessment' },
        'Schedule': { code: 'Schedule', display: 'Schedule' },
        'SearchParameter': { code: 'SearchParameter', display: 'SearchParameter' },
        'Sequence': { code: 'Sequence', display: 'Sequence' },
        'ServiceDefinition': { code: 'ServiceDefinition', display: 'ServiceDefinition' },
        'Slot': { code: 'Slot', display: 'Slot' },
        'Specimen': { code: 'Specimen', display: 'Specimen' },
        'StructureDefinition': { code: 'StructureDefinition', display: 'StructureDefinition' },
        'StructureMap': { code: 'StructureMap', display: 'StructureMap' },
        'Subscription': { code: 'Subscription', display: 'Subscription' },
        'Substance': { code: 'Substance', display: 'Substance' },
        'SupplyDelivery': { code: 'SupplyDelivery', display: 'SupplyDelivery' },
        'SupplyRequest': { code: 'SupplyRequest', display: 'SupplyRequest' },
        'Task': { code: 'Task', display: 'Task' },
        'TestReport': { code: 'TestReport', display: 'TestReport' },
        'TestScript': { code: 'TestScript', display: 'TestScript' },
        'ValueSet': { code: 'ValueSet', display: 'ValueSet' },
        'VisionPrescription': { code: 'VisionPrescription', display: 'VisionPrescription' }
    };

    public readonly allTypes = [
        { code: 'Address', display: 'Address', system: 'http://hl7.org/fhir/data-types' },
        { code: 'Age', display: 'Age', system: 'http://hl7.org/fhir/data-types' },
        { code: 'Annotation', display: 'Annotation', system: 'http://hl7.org/fhir/data-types' },
        { code: 'Attachment', display: 'Attachment', system: 'http://hl7.org/fhir/data-types' },
        { code: 'BackboneElement', display: 'BackboneElement', system: 'http://hl7.org/fhir/data-types' },
        { code: 'CodeableConcept', display: 'CodeableConcept', system: 'http://hl7.org/fhir/data-types' },
        { code: 'Coding', display: 'Coding', system: 'http://hl7.org/fhir/data-types' },
        { code: 'ContactDetail', display: 'ContactDetail', system: 'http://hl7.org/fhir/data-types' },
        { code: 'ContactPoint', display: 'ContactPoint', system: 'http://hl7.org/fhir/data-types' },
        { code: 'Contributor', display: 'Contributor', system: 'http://hl7.org/fhir/data-types' },
        { code: 'Count', display: 'Count', system: 'http://hl7.org/fhir/data-types' },
        { code: 'DataRequirement', display: 'DataRequirement', system: 'http://hl7.org/fhir/data-types' },
        { code: 'Distance', display: 'Distance', system: 'http://hl7.org/fhir/data-types' },
        { code: 'Dosage', display: 'Dosage', system: 'http://hl7.org/fhir/data-types' },
        { code: 'Duration', display: 'Duration', system: 'http://hl7.org/fhir/data-types' },
        { code: 'Element', display: 'Element', system: 'http://hl7.org/fhir/data-types' },
        { code: 'ElementDefinition', display: 'ElementDefinition', system: 'http://hl7.org/fhir/data-types' },
        { code: 'Extension', display: 'Extension', system: 'http://hl7.org/fhir/data-types' },
        { code: 'HumanName', display: 'HumanName', system: 'http://hl7.org/fhir/data-types' },
        { code: 'Identifier', display: 'Identifier', system: 'http://hl7.org/fhir/data-types' },
        { code: 'Meta', display: 'Meta', system: 'http://hl7.org/fhir/data-types' },
        { code: 'Money', display: 'Money', system: 'http://hl7.org/fhir/data-types' },
        { code: 'Narrative', display: 'Narrative', system: 'http://hl7.org/fhir/data-types' },
        { code: 'ParameterDefinition', display: 'ParameterDefinition', system: 'http://hl7.org/fhir/data-types' },
        { code: 'Period', display: 'Period', system: 'http://hl7.org/fhir/data-types' },
        { code: 'Quantity', display: 'Quantity', system: 'http://hl7.org/fhir/data-types' },
        { code: 'Range', display: 'Range', system: 'http://hl7.org/fhir/data-types' },
        { code: 'Ratio', display: 'Ratio', system: 'http://hl7.org/fhir/data-types' },
        { code: 'Reference', display: 'Reference', system: 'http://hl7.org/fhir/data-types' },
        { code: 'RelatedArtifact', display: 'RelatedArtifact', system: 'http://hl7.org/fhir/data-types' },
        { code: 'SampledData', display: 'SampledData', system: 'http://hl7.org/fhir/data-types' },
        { code: 'Signature', display: 'Signature', system: 'http://hl7.org/fhir/data-types' },
        { code: 'SimpleQuantity', display: 'SimpleQuantity', system: 'http://hl7.org/fhir/data-types' },
        { code: 'Timing', display: 'Timing', system: 'http://hl7.org/fhir/data-types' },
        { code: 'TriggerDefinition', display: 'TriggerDefinition', system: 'http://hl7.org/fhir/data-types' },
        { code: 'UsageContext', display: 'UsageContext', system: 'http://hl7.org/fhir/data-types' },
        { code: 'base64Binary', display: 'base64Binary', system: 'http://hl7.org/fhir/data-types' },
        { code: 'boolean', display: 'boolean', system: 'http://hl7.org/fhir/data-types' },
        { code: 'code', display: 'code', system: 'http://hl7.org/fhir/data-types' },
        { code: 'date', display: 'date', system: 'http://hl7.org/fhir/data-types' },
        { code: 'dateTime', display: 'dateTime', system: 'http://hl7.org/fhir/data-types' },
        { code: 'decimal', display: 'decimal', system: 'http://hl7.org/fhir/data-types' },
        { code: 'id', display: 'id', system: 'http://hl7.org/fhir/data-types' },
        { code: 'instant', display: 'instant', system: 'http://hl7.org/fhir/data-types' },
        { code: 'integer', display: 'integer', system: 'http://hl7.org/fhir/data-types' },
        { code: 'markdown', display: 'markdown', system: 'http://hl7.org/fhir/data-types' },
        { code: 'oid', display: 'oid', system: 'http://hl7.org/fhir/data-types' },
        { code: 'positiveInt', display: 'positiveInt', system: 'http://hl7.org/fhir/data-types' },
        { code: 'string', display: 'string', system: 'http://hl7.org/fhir/data-types' },
        { code: 'time', display: 'time', system: 'http://hl7.org/fhir/data-types' },
        { code: 'unsignedInt', display: 'unsignedInt', system: 'http://hl7.org/fhir/data-types' },
        { code: 'uri', display: 'uri', system: 'http://hl7.org/fhir/data-types' },
        { code: 'uuid', display: 'uuid', system: 'http://hl7.org/fhir/data-types' },
        { code: 'xhtml', display: 'XHTML', system: 'http://hl7.org/fhir/data-types' },
        { code: 'Account', display: 'Account', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'ActivityDefinition', display: 'ActivityDefinition', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'AdverseEvent', display: 'AdverseEvent', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'AllergyIntolerance', display: 'AllergyIntolerance', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Appointment', display: 'Appointment', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'AppointmentResponse', display: 'AppointmentResponse', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'AuditEvent', display: 'AuditEvent', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Basic', display: 'Basic', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Binary', display: 'Binary', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'BodySite', display: 'BodySite', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Bundle', display: 'Bundle', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'CapabilityStatement', display: 'CapabilityStatement', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'CarePlan', display: 'CarePlan', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'CareTeam', display: 'CareTeam', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'ChargeItem', display: 'ChargeItem', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Claim', display: 'Claim', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'ClaimResponse', display: 'ClaimResponse', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'ClinicalImpression', display: 'ClinicalImpression', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'CodeSystem', display: 'CodeSystem', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Communication', display: 'Communication', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'CommunicationRequest', display: 'CommunicationRequest', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'CompartmentDefinition', display: 'CompartmentDefinition', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Composition', display: 'Composition', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'ConceptMap', display: 'ConceptMap', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Condition', display: 'Condition', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Consent', display: 'Consent', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Contract', display: 'Contract', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Coverage', display: 'Coverage', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'DataElement', display: 'DataElement', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'DetectedIssue', display: 'DetectedIssue', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Device', display: 'Device', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'DeviceComponent', display: 'DeviceComponent', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'DeviceMetric', display: 'DeviceMetric', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'DeviceRequest', display: 'DeviceRequest', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'DeviceUseStatement', display: 'DeviceUseStatement', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'DiagnosticReport', display: 'DiagnosticReport', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'DocumentManifest', display: 'DocumentManifest', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'DocumentReference', display: 'DocumentReference', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'DomainResource', display: 'DomainResource', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'EligibilityRequest', display: 'EligibilityRequest', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'EligibilityResponse', display: 'EligibilityResponse', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Encounter', display: 'Encounter', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Endpoint', display: 'Endpoint', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'EnrollmentRequest', display: 'EnrollmentRequest', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'EnrollmentResponse', display: 'EnrollmentResponse', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'EpisodeOfCare', display: 'EpisodeOfCare', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'ExpansionProfile', display: 'ExpansionProfile', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'ExplanationOfBenefit', display: 'ExplanationOfBenefit', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'FamilyMemberHistory', display: 'FamilyMemberHistory', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Flag', display: 'Flag', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Goal', display: 'Goal', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'GraphDefinition', display: 'GraphDefinition', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Group', display: 'Group', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'GuidanceResponse', display: 'GuidanceResponse', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'HealthcareService', display: 'HealthcareService', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'ImagingManifest', display: 'ImagingManifest', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'ImagingStudy', display: 'ImagingStudy', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Immunization', display: 'Immunization', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'ImmunizationRecommendation', display: 'ImmunizationRecommendation', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'ImplementationGuide', display: 'ImplementationGuide', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Library', display: 'Library', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Linkage', display: 'Linkage', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'List', display: 'List', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Location', display: 'Location', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Measure', display: 'Measure', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'MeasureReport', display: 'MeasureReport', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Media', display: 'Media', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Medication', display: 'Medication', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'MedicationAdministration', display: 'MedicationAdministration', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'MedicationDispense', display: 'MedicationDispense', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'MedicationRequest', display: 'MedicationRequest', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'MedicationStatement', display: 'MedicationStatement', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'MessageDefinition', display: 'MessageDefinition', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'MessageHeader', display: 'MessageHeader', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'NamingSystem', display: 'NamingSystem', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'NutritionOrder', display: 'NutritionOrder', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Observation', display: 'Observation', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'OperationDefinition', display: 'OperationDefinition', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'OperationOutcome', display: 'OperationOutcome', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Organization', display: 'Organization', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Parameters', display: 'Parameters', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Patient', display: 'Patient', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'PaymentNotice', display: 'PaymentNotice', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'PaymentReconciliation', display: 'PaymentReconciliation', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Person', display: 'Person', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'PlanDefinition', display: 'PlanDefinition', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Practitioner', display: 'Practitioner', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'PractitionerRole', display: 'PractitionerRole', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Procedure', display: 'Procedure', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'ProcedureRequest', display: 'ProcedureRequest', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'ProcessRequest', display: 'ProcessRequest', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'ProcessResponse', display: 'ProcessResponse', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Provenance', display: 'Provenance', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Questionnaire', display: 'Questionnaire', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'QuestionnaireResponse', display: 'QuestionnaireResponse', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'ReferralRequest', display: 'ReferralRequest', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'RelatedPerson', display: 'RelatedPerson', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'RequestGroup', display: 'RequestGroup', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'ResearchStudy', display: 'ResearchStudy', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'ResearchSubject', display: 'ResearchSubject', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Resource', display: 'Resource', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'RiskAssessment', display: 'RiskAssessment', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Schedule', display: 'Schedule', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'SearchParameter', display: 'SearchParameter', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Sequence', display: 'Sequence', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'ServiceDefinition', display: 'ServiceDefinition', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Slot', display: 'Slot', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Specimen', display: 'Specimen', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'StructureDefinition', display: 'StructureDefinition', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'StructureMap', display: 'StructureMap', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Subscription', display: 'Subscription', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Substance', display: 'Substance', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'SupplyDelivery', display: 'SupplyDelivery', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'SupplyRequest', display: 'SupplyRequest', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Task', display: 'Task', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'TestReport', display: 'TestReport', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'TestScript', display: 'TestScript', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'ValueSet', display: 'ValueSet', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'VisionPrescription', display: 'VisionPrescription', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Type', display: 'Type', system: 'http://hl7.org/fhir/abstract-types' },
        { code: 'Any', display: 'Any', system: 'http://hl7.org/fhir/abstract-types' }
    ];

    public readonly definedTypeCodes: Coding[] = [
        { code: 'Address', display: 'Address', system: 'http://hl7.org/fhir/data-types' },
        { code: 'Age', display: 'Age', system: 'http://hl7.org/fhir/data-types' },
        { code: 'Annotation', display: 'Annotation', system: 'http://hl7.org/fhir/data-types' },
        { code: 'Attachment', display: 'Attachment', system: 'http://hl7.org/fhir/data-types' },
        { code: 'BackboneElement', display: 'BackboneElement', system: 'http://hl7.org/fhir/data-types' },
        { code: 'CodeableConcept', display: 'CodeableConcept', system: 'http://hl7.org/fhir/data-types' },
        { code: 'Coding', display: 'Coding', system: 'http://hl7.org/fhir/data-types' },
        { code: 'ContactDetail', display: 'ContactDetail', system: 'http://hl7.org/fhir/data-types' },
        { code: 'ContactPoint', display: 'ContactPoint', system: 'http://hl7.org/fhir/data-types' },
        { code: 'Contributor', display: 'Contributor', system: 'http://hl7.org/fhir/data-types' },
        { code: 'Count', display: 'Count', system: 'http://hl7.org/fhir/data-types' },
        { code: 'DataRequirement', display: 'DataRequirement', system: 'http://hl7.org/fhir/data-types' },
        { code: 'Distance', display: 'Distance', system: 'http://hl7.org/fhir/data-types' },
        { code: 'Dosage', display: 'Dosage', system: 'http://hl7.org/fhir/data-types' },
        { code: 'Duration', display: 'Duration', system: 'http://hl7.org/fhir/data-types' },
        { code: 'Element', display: 'Element', system: 'http://hl7.org/fhir/data-types' },
        { code: 'ElementDefinition', display: 'ElementDefinition', system: 'http://hl7.org/fhir/data-types' },
        { code: 'Extension', display: 'Extension', system: 'http://hl7.org/fhir/data-types' },
        { code: 'HumanName', display: 'HumanName', system: 'http://hl7.org/fhir/data-types' },
        { code: 'Identifier', display: 'Identifier', system: 'http://hl7.org/fhir/data-types' },
        { code: 'Meta', display: 'Meta', system: 'http://hl7.org/fhir/data-types' },
        { code: 'Money', display: 'Money', system: 'http://hl7.org/fhir/data-types' },
        { code: 'Narrative', display: 'Narrative', system: 'http://hl7.org/fhir/data-types' },
        { code: 'ParameterDefinition', display: 'ParameterDefinition', system: 'http://hl7.org/fhir/data-types' },
        { code: 'Period', display: 'Period', system: 'http://hl7.org/fhir/data-types' },
        { code: 'Quantity', display: 'Quantity', system: 'http://hl7.org/fhir/data-types' },
        { code: 'Range', display: 'Range', system: 'http://hl7.org/fhir/data-types' },
        { code: 'Ratio', display: 'Ratio', system: 'http://hl7.org/fhir/data-types' },
        { code: 'Reference', display: 'Reference', system: 'http://hl7.org/fhir/data-types' },
        { code: 'RelatedArtifact', display: 'RelatedArtifact', system: 'http://hl7.org/fhir/data-types' },
        { code: 'SampledData', display: 'SampledData', system: 'http://hl7.org/fhir/data-types' },
        { code: 'Signature', display: 'Signature', system: 'http://hl7.org/fhir/data-types' },
        { code: 'SimpleQuantity', display: 'SimpleQuantity', system: 'http://hl7.org/fhir/data-types' },
        { code: 'Timing', display: 'Timing', system: 'http://hl7.org/fhir/data-types' },
        { code: 'TriggerDefinition', display: 'TriggerDefinition', system: 'http://hl7.org/fhir/data-types' },
        { code: 'UsageContext', display: 'UsageContext', system: 'http://hl7.org/fhir/data-types' },
        { code: 'base64Binary', display: 'base64Binary', system: 'http://hl7.org/fhir/data-types' },
        { code: 'boolean', display: 'boolean', system: 'http://hl7.org/fhir/data-types' },
        { code: 'code', display: 'code', system: 'http://hl7.org/fhir/data-types' },
        { code: 'date', display: 'date', system: 'http://hl7.org/fhir/data-types' },
        { code: 'dateTime', display: 'dateTime', system: 'http://hl7.org/fhir/data-types' },
        { code: 'decimal', display: 'decimal', system: 'http://hl7.org/fhir/data-types' },
        { code: 'id', display: 'id', system: 'http://hl7.org/fhir/data-types' },
        { code: 'instant', display: 'instant', system: 'http://hl7.org/fhir/data-types' },
        { code: 'integer', display: 'integer', system: 'http://hl7.org/fhir/data-types' },
        { code: 'markdown', display: 'markdown', system: 'http://hl7.org/fhir/data-types' },
        { code: 'oid', display: 'oid', system: 'http://hl7.org/fhir/data-types' },
        { code: 'positiveInt', display: 'positiveInt', system: 'http://hl7.org/fhir/data-types' },
        { code: 'string', display: 'string', system: 'http://hl7.org/fhir/data-types' },
        { code: 'time', display: 'time', system: 'http://hl7.org/fhir/data-types' },
        { code: 'unsignedInt', display: 'unsignedInt', system: 'http://hl7.org/fhir/data-types' },
        { code: 'uri', display: 'uri', system: 'http://hl7.org/fhir/data-types' },
        { code: 'uuid', display: 'uuid', system: 'http://hl7.org/fhir/data-types' },
        { code: 'xhtml', display: 'XHTML', system: 'http://hl7.org/fhir/data-types' },
        { code: 'Account', display: 'Account', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'ActivityDefinition', display: 'ActivityDefinition', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'AdverseEvent', display: 'AdverseEvent', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'AllergyIntolerance', display: 'AllergyIntolerance', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Appointment', display: 'Appointment', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'AppointmentResponse', display: 'AppointmentResponse', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'AuditEvent', display: 'AuditEvent', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Basic', display: 'Basic', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Binary', display: 'Binary', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'BodySite', display: 'BodySite', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Bundle', display: 'Bundle', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'CapabilityStatement', display: 'CapabilityStatement', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'CarePlan', display: 'CarePlan', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'CareTeam', display: 'CareTeam', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'ChargeItem', display: 'ChargeItem', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Claim', display: 'Claim', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'ClaimResponse', display: 'ClaimResponse', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'ClinicalImpression', display: 'ClinicalImpression', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'CodeSystem', display: 'CodeSystem', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Communication', display: 'Communication', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'CommunicationRequest', display: 'CommunicationRequest', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'CompartmentDefinition', display: 'CompartmentDefinition', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Composition', display: 'Composition', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'ConceptMap', display: 'ConceptMap', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Condition', display: 'Condition', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Consent', display: 'Consent', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Contract', display: 'Contract', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Coverage', display: 'Coverage', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'DataElement', display: 'DataElement', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'DetectedIssue', display: 'DetectedIssue', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Device', display: 'Device', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'DeviceComponent', display: 'DeviceComponent', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'DeviceMetric', display: 'DeviceMetric', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'DeviceRequest', display: 'DeviceRequest', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'DeviceUseStatement', display: 'DeviceUseStatement', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'DiagnosticReport', display: 'DiagnosticReport', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'DocumentManifest', display: 'DocumentManifest', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'DocumentReference', display: 'DocumentReference', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'DomainResource', display: 'DomainResource', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'EligibilityRequest', display: 'EligibilityRequest', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'EligibilityResponse', display: 'EligibilityResponse', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Encounter', display: 'Encounter', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Endpoint', display: 'Endpoint', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'EnrollmentRequest', display: 'EnrollmentRequest', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'EnrollmentResponse', display: 'EnrollmentResponse', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'EpisodeOfCare', display: 'EpisodeOfCare', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'ExpansionProfile', display: 'ExpansionProfile', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'ExplanationOfBenefit', display: 'ExplanationOfBenefit', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'FamilyMemberHistory', display: 'FamilyMemberHistory', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Flag', display: 'Flag', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Goal', display: 'Goal', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'GraphDefinition', display: 'GraphDefinition', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Group', display: 'Group', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'GuidanceResponse', display: 'GuidanceResponse', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'HealthcareService', display: 'HealthcareService', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'ImagingManifest', display: 'ImagingManifest', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'ImagingStudy', display: 'ImagingStudy', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Immunization', display: 'Immunization', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'ImmunizationRecommendation', display: 'ImmunizationRecommendation', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'ImplementationGuide', display: 'ImplementationGuide', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Library', display: 'Library', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Linkage', display: 'Linkage', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'List', display: 'List', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Location', display: 'Location', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Measure', display: 'Measure', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'MeasureReport', display: 'MeasureReport', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Media', display: 'Media', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Medication', display: 'Medication', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'MedicationAdministration', display: 'MedicationAdministration', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'MedicationDispense', display: 'MedicationDispense', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'MedicationRequest', display: 'MedicationRequest', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'MedicationStatement', display: 'MedicationStatement', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'MessageDefinition', display: 'MessageDefinition', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'MessageHeader', display: 'MessageHeader', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'NamingSystem', display: 'NamingSystem', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'NutritionOrder', display: 'NutritionOrder', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Observation', display: 'Observation', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'OperationDefinition', display: 'OperationDefinition', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'OperationOutcome', display: 'OperationOutcome', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Organization', display: 'Organization', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Parameters', display: 'Parameters', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Patient', display: 'Patient', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'PaymentNotice', display: 'PaymentNotice', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'PaymentReconciliation', display: 'PaymentReconciliation', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Person', display: 'Person', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'PlanDefinition', display: 'PlanDefinition', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Practitioner', display: 'Practitioner', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'PractitionerRole', display: 'PractitionerRole', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Procedure', display: 'Procedure', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'ProcedureRequest', display: 'ProcedureRequest', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'ProcessRequest', display: 'ProcessRequest', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'ProcessResponse', display: 'ProcessResponse', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Provenance', display: 'Provenance', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Questionnaire', display: 'Questionnaire', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'QuestionnaireResponse', display: 'QuestionnaireResponse', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'ReferralRequest', display: 'ReferralRequest', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'RelatedPerson', display: 'RelatedPerson', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'RequestGroup', display: 'RequestGroup', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'ResearchStudy', display: 'ResearchStudy', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'ResearchSubject', display: 'ResearchSubject', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Resource', display: 'Resource', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'RiskAssessment', display: 'RiskAssessment', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Schedule', display: 'Schedule', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'SearchParameter', display: 'SearchParameter', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Sequence', display: 'Sequence', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'ServiceDefinition', display: 'ServiceDefinition', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Slot', display: 'Slot', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Specimen', display: 'Specimen', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'StructureDefinition', display: 'StructureDefinition', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'StructureMap', display: 'StructureMap', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Subscription', display: 'Subscription', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Substance', display: 'Substance', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'SupplyDelivery', display: 'SupplyDelivery', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'SupplyRequest', display: 'SupplyRequest', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'Task', display: 'Task', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'TestReport', display: 'TestReport', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'TestScript', display: 'TestScript', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'ValueSet', display: 'ValueSet', system: 'http://hl7.org/fhir/resource-types' },
        { code: 'VisionPrescription', display: 'VisionPrescription', system: 'http://hl7.org/fhir/resource-types' }
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
}
