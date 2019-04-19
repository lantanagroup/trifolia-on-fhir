import {ParseConformance} from 'fhir/parseConformance';
import {Fhir, Versions as FhirVersions} from 'fhir/fhir';
import * as fs from 'fs-extra';
import * as path from 'path';

export function joinUrl(...parts: string[]) {
  let url = '';

  for (let i = 0; i < parts.length; i++) {
    const argument = parts[i].toString();

    if (url && !url.endsWith('/')) {
      url += '/';
    }

    url += argument.startsWith('/') ? argument.substring(1) : argument;
  }

  return url;
}

export function buildUrl(base: string, resourceType?: string, id?: string, operation?: string, params?: {[key: string]: any}) {
  let path = base;

  if (!path) {
    return;
  }

  if (resourceType) {
    path = joinUrl(path, resourceType);

    if (id) {
      path = joinUrl(path, id);
    }
  }

  if (operation) {
    path = joinUrl(path, operation);
  }

  if (params) {
    const keys = Object.keys(params);
    const paramArray = keys.map((key) => {
      const value = encodeURIComponent(params[key]);
      return key + '=' + value;
    });

    if (paramArray.length > 0) {
      path += '?' + paramArray.join('&');
    }
  }

  return path;
}

export function parseUrl(url: string, base?: string) {
  const parseUrlRegex = /(Account|ActivityDefinition|AdverseEvent|AllergyIntolerance|Appointment|AppointmentResponse|AuditEvent|Basic|Binary|BodySite|Bundle|CapabilityStatement|CarePlan|CareTeam|ChargeItem|Claim|ClaimResponse|ClinicalImpression|CodeSystem|Communication|CommunicationRequest|CompartmentDefinition|Composition|ConceptMap|Condition|Consent|Contract|Coverage|DataElement|DetectedIssue|Device|DeviceComponent|DeviceMetric|DeviceRequest|DeviceUseStatement|DiagnosticReport|DocumentManifest|DocumentReference|EligibilityRequest|EligibilityResponse|Encounter|Endpoint|EnrollmentRequest|EnrollmentResponse|EpisodeOfCare|ExpansionProfile|ExplanationOfBenefit|FamilyMemberHistory|Flag|Goal|GraphDefinition|Group|GuidanceResponse|HealthcareService|ImagingManifest|ImagingStudy|Immunization|ImmunizationRecommendation|ImplementationGuide|Library|Linkage|List|Location|Measure|MeasureReport|Media|MedicationAdministration|MedicationDispense|MedicationRequest|MedicationStatement|Medication|MessageDefinition|MessageHeader|NamingSystem|NutritionOrder|Observation|OperationDefinition|OperationOutcome|Organization|Patient|PaymentNotice|PaymentReconciliation|Person|PlanDefinition|PractitionerRole|Practitioner|ProcedureRequest|Procedure|ProcessRequest|ProcessResponse|Provenance|QuestionnaireResponse|Questionnaire|ReferralRequest|RelatedPerson|RequestGroup|ResearchStudy|ResearchSubject|RiskAssessment|Schedule|SearchParameter|Sequence|ServiceDefinition|Slot|Specimen|StructureDefinition|StructureMap|Subscription|Substance|SupplyDelivery|SupplyRequest|Task|TestReport|TestScript|ValueSet|VisionPrescription)(\/([A-Za-z0-9\-\.]+))?(\/_history\/([A-Za-z0-9\-\.]{1,64}))?/g;

  if (base && base.lastIndexOf('/') === base.length-1) {
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

function getJsonFromFile(relativePath: string) {
  const actualPath = path.join(__dirname, relativePath);
  const contentStream = fs.readFileSync(actualPath);
  const content = contentStream.toString('utf8');
  return JSON.parse(content);
}

export function getFhirStu3Instance() {
  const parser = new ParseConformance(false, FhirVersions.STU3);
  const valueSets = getJsonFromFile('assets/stu3/valuesets.json');
  const types = getJsonFromFile('assets/stu3/profiles-types.json');
  const resources = getJsonFromFile('assets/stu3/profiles-resources.json');
  const iso3166 = getJsonFromFile('assets/stu3/codesystem-iso3166.json');

  parser.parseBundle(valueSets);
  parser.parseBundle(types);
  parser.parseBundle(resources);
  parser.loadCodeSystem(iso3166);

  const fhir = new Fhir(parser);
  return fhir;
}

export function getFhirR4Instance() {
  const parser = new ParseConformance(false, FhirVersions.R4);
  const valueSets = getJsonFromFile('assets/r4/valuesets.json');
  const types = getJsonFromFile('assets/r4/profiles-types.json');
  const resources = getJsonFromFile('assets/r4/profiles-resources.json');
  const iso3166 = getJsonFromFile('assets/r4/codesystem-iso3166.json');

  parser.parseBundle(valueSets);
  parser.parseBundle(types);
  parser.parseBundle(resources);
  parser.loadCodeSystem(iso3166);

  const fhir = new Fhir(parser);
  return fhir;
}
