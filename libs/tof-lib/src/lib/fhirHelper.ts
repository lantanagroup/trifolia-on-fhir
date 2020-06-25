import {ImplementationGuide as R4ImplementationGuide, OperationOutcome, ResourceReference} from './r4/fhir';
import {ImplementationGuide as STU3ImplementationGuide} from './stu3/fhir';
import nanoid from 'nanoid/generate';
import * as semver from 'semver';
import {Versions} from 'fhir/fhir';


export function identifyRelease(fhirVersion: string): Versions {
  if (!fhirVersion) {
    return Versions.STU3;
  } else if (semver.satisfies(fhirVersion, '>= 3.2.0 < 4.2.0')) {
    return Versions.R4;
  } else if (semver.satisfies(fhirVersion, '>= 1.1.0 <= 3.0.2')) {
    return Versions.STU3;
  } else {
    throw new Error('Unexpected FHIR Version ' + fhirVersion);
  }
}

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

/**
 * Builds a URL for the FHIR API from arguments
 * @param base The base of the URL (ex: https://some-fhir-server.com/fhir)
 * @param resourceType The resource type to query for
 * @param id The id of the resource
 * @param operation An operation to perform on the server (no resource type), the resource type, or the resource instance (with id)
 * @param params The query parameters to add onto the URL
 * @param separateArrayParams Indicates whether array-based query parameters should be combined using a comma (,) or if the query param should be repeated for each element of the array
 */
export function buildUrl(base: string, resourceType?: string, id?: string, operation?: string, params?: {[key: string]: any}, separateArrayParams = false) {
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
    if (!operation.startsWith('$')) operation = '$' + operation;
    path = joinUrl(path, operation);
  }

  if (params) {
    const keys = Object.keys(params);
    const paramArray = [];

    keys.forEach((key) => {
      if (params[key] instanceof Array) {
        const valueArray = <any[]> params[key];

        if (!separateArrayParams) {
          paramArray.push(`${key}=${encodeURIComponent(valueArray.join(','))}`);
        } else {
          valueArray.forEach((element) => paramArray.push(`${key}=${encodeURIComponent(element)}`));
        }
      } else {
        const value = params[key];
        paramArray.push(`${key}=${encodeURIComponent(value)}`);
      }
    });

    if (paramArray.length > 0) {
      path += '?' + paramArray.join('&');
    }
  }

  return path;
}

export function parseUrl(url: string, base?: string) {
  const parseUrlRegex = /(Account|ActivityDefinition|AdverseEvent|AllergyIntolerance|Appointment|AppointmentResponse|AuditEvent|Basic|Binary|BodySite|Bundle|CapabilityStatement|CarePlan|CareTeam|ChargeItem|Claim|ClaimResponse|ClinicalImpression|CodeSystem|Communication|CommunicationRequest|CompartmentDefinition|Composition|ConceptMap|Condition|Consent|Contract|Coverage|DataElement|DetectedIssue|Device|DeviceComponent|DeviceMetric|DeviceRequest|DeviceUseStatement|DiagnosticReport|DocumentManifest|DocumentReference|EligibilityRequest|EligibilityResponse|Encounter|Endpoint|EnrollmentRequest|EnrollmentResponse|EpisodeOfCare|ExpansionProfile|ExplanationOfBenefit|FamilyMemberHistory|Flag|Goal|GraphDefinition|Group|GuidanceResponse|HealthcareService|ImagingManifest|ImagingStudy|Immunization|ImmunizationRecommendation|ImplementationGuide|Library|Linkage|List|Location|Measure|MeasureReport|Media|MedicationAdministration|MedicationDispense|MedicationRequest|MedicationStatement|Medication|MessageDefinition|MessageHeader|NamingSystem|NutritionOrder|Observation|OperationDefinition|OperationOutcome|Organization|Patient|PaymentNotice|PaymentReconciliation|Person|PlanDefinition|PractitionerRole|Practitioner|ProcedureRequest|Procedure|ProcessRequest|ProcessResponse|Provenance|QuestionnaireResponse|Questionnaire|ReferralRequest|RelatedPerson|RequestGroup|ResearchStudy|ResearchSubject|RiskAssessment|Schedule|SearchParameter|Sequence|ServiceDefinition|ServiceRequest|Slot|Specimen|StructureDefinition|StructureMap|Subscription|Substance|SupplyDelivery|SupplyRequest|Task|TestReport|TestScript|ValueSet|VisionPrescription)(\/([A-Za-z0-9\-\.]+))?(\/_history\/([A-Za-z0-9\-\.]{1,64}))?/g;

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

export function createOperationOutcome(severity: string, code: string, diagnostics: string) {
  return <OperationOutcome> {
    resourceType: 'OperationOutcome',
    issue: [{
      severity: severity,
      code: code,
      diagnostics: diagnostics
    }]
  };
}

export function getExtensionString(obj: any, url: string): string {
  if (!obj) {
    return;
  }

  const foundExtension = (obj.extension || []).find((ex) => ex.url === url);

  if (foundExtension) {
    return foundExtension.valueString;
  }
}

export function setExtensionString(obj: any, url: string, value: string) {
  let foundExtension = (obj.extension || []).find((ex) => ex.url === url);

  if (value) {
    if (!foundExtension) {
      if (!obj.extension) {
        obj.extension = [];
      }

      foundExtension = { url: url };
      obj.extension.push(foundExtension);
    }

    foundExtension.valueString = value;
  } else if (!value && foundExtension) {
    const index = obj.extension.indexOf(foundExtension);
    obj.extension.splice(index, 1);
  }
}


export function getDefaultImplementationGuideResourcePath(reference: ResourceReference) {
  if (reference && reference.reference) {
    const parsed = parseUrl(reference.reference);

    if (parsed) {
      return `${parsed.resourceType.toLowerCase()}/${parsed.id}.xml`;
    }
  }
}

export function generateId(): string {
  return nanoid('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUBWXYZ', 8);
}

export class MediaReference {
  id: string;
  name: string;     // this becomes ImageItem.title
  description: string;
}

export function getImplementationGuideMediaReferences(fhirVersion: 'stu3'|'r4', implementationGuide: STU3ImplementationGuide | R4ImplementationGuide) {
  if (!implementationGuide) {
    return [];
  }

  switch (fhirVersion) {
    case 'stu3':
      const stu3ImplementationGuide = <STU3ImplementationGuide> implementationGuide;
      const mediaReferences: MediaReference[] = [];

      (stu3ImplementationGuide.package || []).forEach((pkg) => {
        (pkg.resource || [])
          .filter((resource) => resource.sourceReference && resource.sourceReference.reference && resource.sourceReference.reference.startsWith('Media/'))
          .forEach((resource) => {
            const mediaRef = new MediaReference();
            mediaRef.id = resource.sourceReference.reference.substring('Media/'.length);
            mediaRef.name = resource.name;
            mediaRef.description = resource.description;
            mediaReferences.push(mediaRef);
          });
      });

      return mediaReferences;
    default:
      const r4ImplementationGuide = <R4ImplementationGuide> implementationGuide;

      if (!r4ImplementationGuide.definition) {
        return [];
      }

      return (r4ImplementationGuide.definition.resource || [])
        .filter((resource) => {
          return resource.reference && resource.reference.reference && resource.reference.reference.startsWith('Media/');
        })
        .map((resource) => {
          const mediaRef = new MediaReference();
          mediaRef.id = resource.reference.reference.substring('Media/'.length);
          mediaRef.name = resource.name;
          mediaRef.description = resource.description;
          return mediaRef;
        });
  }
}
