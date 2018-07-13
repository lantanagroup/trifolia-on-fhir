const {resolve} = require('url');
const _ = require('underscore');

module.exports = {
    buildUrl: function(base, resourceType, id, operation, params) {
        let path = base;

        if (!path) {
            return;
        }

        if (resourceType) {
            path = resolve(path, resourceType);

            if (!path.endsWith('/')) path += '/';

            if (id) {
                path = resolve(path, id);

                if (!path.endsWith('/')) path += '/';
            }
        }

        if (operation) {
            path = resolve(path, operation);
        }

        if (params) {
            const paramArray = _.map(Object.keys(params), (key) => {
                return key + '=' + params[key];
            });

            if (paramArray.length > 0) {
                path += '?' + paramArray.join('&');
            }
        }

        return path;
    },
    parseUrl: function(url, base) {
        const parseUrlRegex = /(Account|ActivityDefinition|AdverseEvent|AllergyIntolerance|Appointment|AppointmentResponse|AuditEvent|Basic|Binary|BodySite|Bundle|CapabilityStatement|CarePlan|CareTeam|ChargeItem|Claim|ClaimResponse|ClinicalImpression|CodeSystem|Communication|CommunicationRequest|CompartmentDefinition|Composition|ConceptMap|Condition|Consent|Contract|Coverage|DataElement|DetectedIssue|Device|DeviceComponent|DeviceMetric|DeviceRequest|DeviceUseStatement|DiagnosticReport|DocumentManifest|DocumentReference|EligibilityRequest|EligibilityResponse|Encounter|Endpoint|EnrollmentRequest|EnrollmentResponse|EpisodeOfCare|ExpansionProfile|ExplanationOfBenefit|FamilyMemberHistory|Flag|Goal|GraphDefinition|Group|GuidanceResponse|HealthcareService|ImagingManifest|ImagingStudy|Immunization|ImmunizationRecommendation|ImplementationGuide|Library|Linkage|List|Location|Measure|MeasureReport|Media|Medication|MedicationAdministration|MedicationDispense|MedicationRequest|MedicationStatement|MessageDefinition|MessageHeader|NamingSystem|NutritionOrder|Observation|OperationDefinition|OperationOutcome|Organization|Patient|PaymentNotice|PaymentReconciliation|Person|PlanDefinition|Practitioner|PractitionerRole|Procedure|ProcedureRequest|ProcessRequest|ProcessResponse|Provenance|Questionnaire|QuestionnaireResponse|ReferralRequest|RelatedPerson|RequestGroup|ResearchStudy|ResearchSubject|RiskAssessment|Schedule|SearchParameter|Sequence|ServiceDefinition|Slot|Specimen|StructureDefinition|StructureMap|Subscription|Substance|SupplyDelivery|SupplyRequest|Task|TestReport|TestScript|ValueSet|VisionPrescription)(\/([A-Za-z0-9\-\.]+))?(\/_history\/([A-Za-z0-9\-\.]{1,64}))?/g;

        if (base.lastIndexOf('/') === base.length-1) {
            base = base.substring(0, base.length - 1);
        }

        const next = url.replace(base, '');
        const match = parseUrlRegex.exec(next);

        if (match) {
            return {
                resourceType: match[1],
                id: match[3],
                historyId: match[5]
            };
        }
    }
};