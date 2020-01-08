import {Coding, DomainResource, HumanName as STU3HumanName, Meta, Practitioner} from './stu3/fhir';
import {HumanName as R4HumanName} from './r4/fhir';
import {ResourceSecurityModel} from './resource-security-model';
import {Globals} from './globals';
import {Identifier} from './r4/fhir';

export class ParsedUrlModel {
  public resourceType: string;
  public id: string;
  public historyId: string;
}

export function getErrorString(err: any, body?: any, defaultMessage?: string) {
  if (err && err.error) {
    if (err.error.message) {
      return err.error.message;
    } else if (typeof err.error === 'string') {
      return err.error;
    } else if (typeof err.error === 'object') {
      if (err.error.resourceType === 'OperationOutcome') {
        if (err.error.issue && err.error.issue.length > 0 && err.error.issue[0].diagnostics) {
          return err.error.issue[0].diagnostics;
        }
      } else if (err.name === 'RequestError') {
        return err.error.message;
      }
    }
  } else if (err && err.message) {
    return err.message;
  } else if (err && err.data) {
    return err.data;
  } else if (typeof err === 'string') {
    return err;
  } else if (body && body.resourceType === 'OperationOutcome') {
    if (body.issue && body.issue.length > 0 && body.issue[0].diagnostics) {
      return body.issue[0].diagnostics;
    }
  }

  return defaultMessage || 'An unknown error occurred';
}

/**
 * Function that can be used by Array.reduce to flatten a multi-level set of arrays.
 * @param callback Should return the child array of the elements
 */
export function reduceFlatten<T>(callback: (next: T) => any[]) {
  const internalFlatten = (previous: T[], children: T[]) => {
    if (children) {
      children.forEach((child) => {
        previous.push(child);
        internalFlatten(previous, callback(child));
      });
    }
  };

  return (previous: any[], current: T): any[] => {
    internalFlatten(previous, callback(current));
    return previous;
  };
}

/**
 * Function that can be used by Array.reduce to get a distinct set of elements.
 * @param callback The callback is required, and used to indicate what the value of each element is that should be used in the comparison.
 */
export function reduceDistinct<T>(callback: (next: T) => any) {
  return (previous: any[], current: T): any[] => {
    const id = callback(current);
    const previousIds = previous.map(prev => callback(prev));

    if (previousIds.indexOf(id) < 0) {
      previous.push(current);
    }

    return previous;
  };
}

/**
 * Helper function that creates a group from the items based on the returned
 * value of the callback function
 * @param items The items to group
 * @param callback The callback whose return value indicates what the key of each item is
 */
export function groupBy<T>(items: T[], callback: (next: T) => any): { [key: string]: any} {
  const groups = {};

  (items || []).forEach((next) => {
    let key = callback(next);

    if (key) {
      key = key.toString();

      if (!groups[key]) {
        groups[key] = [];
      }

      groups[key].push(next);
    }
  });

  return groups;
}

export function getResourceSecurity(resource: DomainResource): ResourceSecurityModel[] {
  if (resource && resource.meta && resource.meta.security) {
    return resource.meta.security
      .filter((security) => security.system === Globals.securitySystem)
      .map((security) => {
        const split = security.code.split('|');

        if (split[0] === 'everyone') {
          return <ResourceSecurityModel> {
            type: 'everyone',
            permission: split[1]
          };
        } else if (split.length === 3) {
          return <ResourceSecurityModel> {
            type: split[0],
            id: split[1],
            permission: split[2]
          };
        }
      });
  }

  return [];
}

export function getHumanNameDisplay(humanName: STU3HumanName | R4HumanName) {
  if (humanName.family && humanName.given && humanName.given.length > 0) {
    return humanName.family + ', ' + humanName.given[0];
  } else if (humanName.family) {
    return humanName.family;
  } else if (humanName.given && humanName.given.length > 0) {
    return humanName.given[0];
  }
}

export function getHumanNamesDisplay(humanNames: (STU3HumanName | R4HumanName)[]) {
  if (!humanNames || humanNames.length === 0) {
    return 'Unspecified';
  } else {
    return getHumanNameDisplay(humanNames[0]);
  }
}

export function ensureSecurity(meta: Meta) {
  if (!meta) {
    return;
  }

  if (!meta.security) {
    meta.security = [];
  }
}

export interface SecurityPermission {
  type: 'user'|'group'|'everyone';
  permission: 'read'|'write';
  id?: string;
}

export function parsePermissions(meta: Meta): SecurityPermission[] {
  return (meta.security || [])
    .filter((security) => {
      return security.system === Globals.securityDelim && security.code;
    })
    .map((security) => {
      const parts = security.code.split(Globals.securityDelim);

      if (parts.length === 2) {
        return {
          type: <any> parts[0],
          permission: <any> parts[1]
        };
      } else if (parts.length === 3) {
        return {
          type: <any> parts[0],
          permission: <any> parts[1],
          id: parts[2]
        };
      }
    });
}

export function findPermission(meta: Meta, type: 'user'|'group'|'everyone', permission: 'read'|'write', id?: string) {
  if (!meta) {
    return false;
  }

  const security = meta.security || [];
  const delimiter = Globals.securityDelim;

  return !!security.find((next) => {
    if (next.system !== Globals.securitySystem) {
      return false;
    }

    if (type === 'everyone') {
      return next.code === `${type}${delimiter}${permission}`;
    } else {
      return next.code === `${type}${delimiter}${id}${delimiter}${permission}`;
    }
  });
}

export function addPermission(meta: Meta, type: 'user'|'group'|'everyone', permission: 'read'|'write', id?: string): boolean {
  ensureSecurity(meta);
  const delim = Globals.securityDelim;

  // Write permissions should always assume read permissions as well
  if (permission === 'write' && !findPermission(meta, type, 'read', id)) {
    addPermission(meta, type, 'read', id);
  }

  const securityValue = type === 'everyone' ? `${type}${delim}${permission}` : `${type}${delim}${id}${delim}${permission}`;
  let found: Coding;

  if (meta && meta.security) {
    found = meta.security.find((security) => security.system === Globals.securitySystem && security.code === securityValue);
  }

  if (!found) {
    meta.security.push({
      system: Globals.securitySystem,
      code: securityValue
    });

    return true;
  }

  return false;
}

export function removePermission(meta: Meta, type: 'user'|'group'|'everyone', permission: 'read'|'write', id?: string): boolean {
  const delim = Globals.securityDelim;

  // Assume that if we're removing read permission, they shouldn't have write permission either
  if (permission === 'read') {
    removePermission(meta, type, 'write', id);
  }

  const securityValue = type === 'everyone' ? `${type}${delim}${permission}` : `${type}${delim}${id}${delim}${permission}`;
  let found: Coding;

  if (meta && meta.security) {
    found = meta.security.find((security) => security.system === Globals.securitySystem && security.code === securityValue);
  }

  if (found) {
    const index = meta.security.indexOf(found);
    meta.security.splice(index, 1);
    return true;
  }

  return false;
}


export function getMetaSecurity(meta: Meta): ResourceSecurityModel[] {
  if (meta && meta.security) {
    return meta.security
      .filter((security) => {
        return security.system === Globals.securitySystem &&
          security.code &&
          security.code.split(Globals.securityDelim).length >= 2;
      })
      .map((security) => {
        const split = security.code.split(Globals.securityDelim);
        const inactiveExtension = (security.extension || []).find((extension) => extension.url === Globals.extensionUrls['extension-coding-inactive']);

        if (split[0] === 'everyone') {
          return <ResourceSecurityModel> {
            type: 'everyone',
            permission: split[1],
            inactive: inactiveExtension && inactiveExtension.valueBoolean === true
          };
        } else if (split.length === 3) {
          return <ResourceSecurityModel> {
            type: split[0],
            id: split[1],
            permission: split[2],
            inactive: inactiveExtension && inactiveExtension.valueBoolean === true
          };
        }
      });
  }

  return [];
}

export function getPractitionerEmail(practitioner: Practitioner) {
  const foundEmail = (practitioner.telecom || []).find((telecom) => telecom.system === 'email');

  if (foundEmail && foundEmail.value) {
    return foundEmail.value.replace('mailto:', '');
  }
}

export function getStringFromBlob(theBlob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.onload = function () {
        resolve(<string> reader.result);
      };
      reader.readAsText(theBlob);
    } catch (ex) {
      reject(ex.message);
    }
  });
}

export function createTableFromArray(headers, data): string {
  let output = '<table>\n<thead>\n<tr>\n';

  headers.forEach((header) => {
    output += `<th>${header}</th>\n`;
  });

  output += '</tr>\n</thead>\n<tbody>\n';

  data.forEach((row: string[]) => {
    output += '<tr>\n';

    row.forEach((cell) => {
      output += `<td>${cell}</td>\n`;
    });

    output += '</tr>\n';
  });

  output += '</tbody>\n</table>\n';

  return output;
}

 export function getDisplayName(name: string | STU3HumanName | Array<STU3HumanName> | R4HumanName | Array<R4HumanName>): string {
  if (!name) {
    return;
  }

  if (name instanceof Array && name.length > 0) {
    return getDisplayName(name[0]);
  }

  if (typeof name === 'string') {
    return <string>name;
  }

  const humanName = <STU3HumanName | R4HumanName> name;
  let display = humanName.family;

  if (humanName.given) {
    if (display) {
      display += ', ';
    } else {
      display = '';
    }

    display += humanName.given.join(' ');
  }

  return display;
}

export function getDisplayIdentifier(identifier: Identifier | Array<Identifier>, ignoreSystem = false) {
  if (!identifier) {
    return '';
  }

  if (identifier instanceof Array && identifier.length > 0) {
    return getDisplayIdentifier(identifier[0], ignoreSystem);
  }

  const obj = <Identifier> identifier;

  if (!ignoreSystem && obj.system && obj.value) {
    return `${obj.value} (${obj.system})`;
  } else if (obj.value) {
    return obj.value;
  } else if (!ignoreSystem && obj.system) {
    return obj.system;
  }

  return '';
}

export function parseReference(reference: string): ParsedUrlModel {
  // This regex is loaded with resource types from both STU3 and R4
  const parseReferenceRegex = /(Account|ActivityDefinition|AdverseEvent|AllergyIntolerance|Appointment|AppointmentResponse|AuditEvent|Basic|Binary|BiologicallyDerivedProduct|BodySite|BodyStructure|Bundle|CapabilityStatement|CarePlan|CareTeam|CatalogEntry|ChargeItem|ChargeItemDefinition|Claim|ClaimResponse|ClinicalImpression|CodeSystem|Communication|CommunicationRequest|CompartmentDefinition|Composition|ConceptMap|Condition|Consent|Contract|Coverage|CoverageEligibilityRequest|CoverageEligibilityResponse|DataElement|DetectedIssue|Device|DeviceComponent|DeviceDefinition|DeviceMetric|DeviceRequest|DeviceUseStatement|DiagnosticReport|DocumentManifest|DocumentReference|EffectEvidenceSynthesis|EligibilityRequest|EligibilityResponse|Encounter|Endpoint|EnrollmentRequest|EnrollmentResponse|EpisodeOfCare|EventDefinition|Evidence|EvidenceVariable|ExampleScenario|ExpansionProfile|ExplanationOfBenefit|FamilyMemberHistory|Flag|Goal|GraphDefinition|Group|GuidanceResponse|HealthcareService|ImagingManifest|ImagingStudy|Immunization|ImmunizationEvaluation|ImmunizationRecommendation|ImplementationGuide|InsurancePlan|Invoice|Library|Linkage|List|Location|Measure|MeasureReport|Media|Medication|MedicationAdministration|MedicationDispense|MedicationKnowledge|MedicationRequest|MedicationStatement|MedicinalProduct|MedicinalProductAuthorization|MedicinalProductContraindication|MedicinalProductIndication|MedicinalProductIngredient|MedicinalProductInteraction|MedicinalProductManufactured|MedicinalProductPackaged|MedicinalProductPharmaceutical|MedicinalProductUndesirableEffect|MessageDefinition|MessageHeader|MolecularSequence|NamingSystem|NutritionOrder|Observation|ObservationDefinition|OperationDefinition|OperationOutcome|Organization|OrganizationAffiliation|Parameters|Patient|PaymentNotice|PaymentReconciliation|Person|PlanDefinition|Practitioner|PractitionerRole|Procedure|ProcedureRequest|ProcessRequest|ProcessResponse|Provenance|Questionnaire|QuestionnaireResponse|ReferralRequest|RelatedPerson|RequestGroup|ResearchDefinition|ResearchElementDefinition|ResearchStudy|ResearchSubject|RiskAssessment|RiskEvidenceSynthesis|Schedule|SearchParameter|Sequence|ServiceDefinition|ServiceRequest|Slot|Specimen|SpecimenDefinition|StructureDefinition|StructureMap|Subscription|Substance|SubstancePolymer|SubstanceReferenceInformation|SubstanceSpecification|SupplyDelivery|SupplyRequest|Task|TerminologyCapabilities|TestReport|TestScript|ValueSet|VerificationResult|VisionPrescription)(\/([A-Za-z0-9\-\.]+))?(\/_history\/([A-Za-z0-9\-\.]{1,64}))?/g;
  const match = parseReferenceRegex.exec(reference);

  if (match) {
    return {
      resourceType: match[1],
      id: match[3],
      historyId: match[5]
    };
  }
}
