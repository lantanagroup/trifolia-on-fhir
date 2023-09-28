import { ResourceSecurityModel } from './resource-security-model';
import { Globals } from './globals';
import { ICoding, IDomainResource, IHumanName, IIdentifier, IMeta, IPractitioner } from './fhirInterfaces';
import { IPermission, IProject, IProjectResource, IUser } from './models';

export class ParsedUrlModel {
  public resourceType: string;
  public id: string;
  public historyId: string;
}

export function pad(num: number, size: number): string {
  let s = num + '';
  while (s.length < size) s = '0' + s;
  return s;
}

export function escapeForXml(value: string) {
  if (!value) return value;
  return value
    .replace(/'/g, '&apos;')
    .replace(/"/g, '&quot;')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function getFhirVersion(releaseVersion: 'stu3' | 'r4') {
  switch (releaseVersion) {
    case 'stu3':
      return '3.0.2';
    case 'r4':
      return '4.0.1';
    default:
      throw new Error(`Unknown FHIR release version ${releaseVersion}`);
  }
}

export function getErrorString(err: any, body?: any, defaultMessage?: string) {
  if (err && err.error) {
    if (err.error.message) {
      return err.error.message;
    } else if (typeof err.error === 'string') {
      if (err.error.startsWith('{')) {
        const obj = JSON.parse(err.error);
        return getErrorString(obj);
      } else {
        return err.error;
      }
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
export function groupBy<T>(items: T[], callback: (next: T) => any): { [key: string]: any } {
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

export function getResourceSecurity(resource: IDomainResource): ResourceSecurityModel[] {
  if (resource && resource.meta && resource.meta.security) {
    return resource.meta.security
      .filter((security) => security.system === Globals.securitySystem)
      .map((security) => {
        const split = security.code.split('|');

        if (split[0] === 'everyone') {
          return <ResourceSecurityModel>{
            type: 'everyone',
            permission: split[1]
          };
        } else if (split.length === 3) {
          return <ResourceSecurityModel>{
            type: split[0],
            id: split[1],
            permission: split[2]
          };
        }
      });
  }

  return [];
}

export function getHumanNameDisplay(humanName: IHumanName) {
  if (!humanName) return;

  if (humanName.family && humanName.given && humanName.given.length > 0) {
    return humanName.family + ', ' + humanName.given[0];
  } else if (humanName.family) {
    return humanName.family;
  } else if (humanName.given && humanName.given.length > 0) {
    return humanName.given[0];
  } else if (humanName.text) {
    return humanName.text;
  }
}

export function getHumanNamesDisplay(humanNames: IHumanName[]) {
  if (!humanNames || humanNames.length === 0) {
    return 'Unspecified';
  } else {
    const officialName = humanNames.find(n => n.use === 'official' || !n.use);
    const aliasName = humanNames.find(n => n.use === 'anonymous');
    const official = getHumanNameDisplay(officialName);
    const alias = getHumanNameDisplay(aliasName);

    if (official && alias) {
      return official + ' - ' + alias;
    } else if (official && !alias) {
      return official;
    } else if (alias) {
      return alias;
    }
  }
}

export function ensureSecurity(meta: IMeta) {
  if (!meta) {
    return;
  }

  if (!meta.security) {
    meta.security = [];
  }
}

export interface SecurityPermission {
  type: 'User' | 'Group' | 'everyone';
  permission: 'read' | 'write';
  id?: string;
}

export function parsePermissions(meta: IMeta): SecurityPermission[] {
  return (meta.security || [])
    .filter((security) => {
      return security.system === Globals.securitySystem && security.code;
    })
    .map((security) => {
      const parts = security.code.split(Globals.securityDelim);

      if (parts.length === 2) {
        return {
          type: <any>parts[0],
          permission: <any>parts[1]
        };
      } else if (parts.length === 3) {
        return {
          type: <any>parts[0],
          id: parts[1],
          permission: <any>parts[2]
        };
      }
    });
}

export function findPermission(perms: IPermission[], type: 'User' | 'Group' | 'everyone', grant: 'read' | 'write', targetId?: string) {

  if (!perms) {
    return false;
  }

  return !!perms.find((p: IPermission) => {
    if (type === 'everyone') {
      return p.type === 'everyone' && p.grant == grant;
    } else {
      return p.type === type && p.grant == grant && p.targetId === targetId;
    }
  });
}

export function addPermission(resource: IProject, type: 'User' | 'Group' | 'everyone', grant: 'read' | 'write', targetId?: string): boolean {

  // Write permissions should always assume read permissions as well
  if (grant === 'write' && !findPermission(resource.permissions, type, 'read', targetId)) {
    addPermission(resource, type, 'read', targetId);
  }

  let newPerm: IPermission = { type: type, grant: grant };
  if (type !== 'everyone') {
    newPerm.targetId = targetId;
  }
  let found = false;

  if (!resource.permissions) {
    resource.permissions = [];
  }

  found = findPermission(resource.permissions, type, grant, targetId);

  if (!found) {
    resource.permissions.push(newPerm);
    return true;
  }

  return false;
}

export function removePermission(resource: IProject, type: 'User' | 'Group' | 'everyone', grant: 'read' | 'write', targetId?: string): boolean {
  const delim = Globals.securityDelim;

  // Assume that if we're removing read permission, they shouldn't have write permission either
  if (grant === 'read') {
    removePermission(resource, type, 'write', targetId);
  }

  let index = -1;

  if (resource && resource.permissions) {
    index = type === 'everyone' ? 
      resource.permissions.findIndex((p: IPermission) => p.type === type && p.grant === grant) : 
      resource.permissions.findIndex((p: IPermission) => p.type === type && p.grant === grant && p.targetId === targetId);
  }

  if (index > -1) {
    resource.permissions.splice(index, 1);
    return true;
  }

  return false;
}


export function getMetaSecurity(meta: IMeta): ResourceSecurityModel[] {
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
          return <ResourceSecurityModel>{
            type: 'everyone',
            permission: split[1],
            inactive: inactiveExtension && inactiveExtension.valueBoolean === true
          };
        } else if (split.length === 3) {
          return <ResourceSecurityModel>{
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

export function getPractitionerEmail(practitioner: IPractitioner) {
  const foundEmail = (practitioner.telecom || []).find((telecom) => telecom.system === 'email');

  if (foundEmail && foundEmail.value) {
    return foundEmail.value.replace('mailto:', '');
  }
}

export function getUserEmail(user: IUser) {
  if (user && user.email) {
    return user.email.replace('mailto:', '');
  }
}

export function getStringFromBlob(theBlob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.onload = function () {
        resolve(<string>reader.result);
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

export function getAliasName(names: IHumanName[]) {
  if (!names || !names.length) return;

  const alias = names.find(n => n.use === 'anonymous');

  if (alias && alias.text) {
    return alias.text;
  }
}

export function getDisplayName(name: string | IHumanName | IHumanName[]): string {
  if (!name) {
    return;
  }

  if (name instanceof Array && name.length > 0) {
    const official = name.find(n => !n.use || n.use === 'official');
    return getDisplayName(official);
  }

  if (typeof name === 'string') {
    return <string>name;
  }

  const humanName = name as IHumanName;
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

export function getIdentifierSource(identifier: IIdentifier | IIdentifier[]) {
  if (!identifier) return;

  if (identifier instanceof Array) {
    return getIdentifierSource(identifier.find(i => i.system === 'https://trifolia-fhir.lantanagroup.com'));
  }

  if (!identifier.value) return;

  const parts = identifier.value.split('|');

  if (parts.length === 2) {
    switch (parts[0]) {
      case 'waad':
        return 'User/Pass';
      case 'google-oauth2':
        return 'Google';
      case 'windowslive':
        return 'Microsoft';
      case 'github':
        return 'GitHub';
      case 'facebook':
        return 'Facebook';
      default:
        return parts[0];
    }
  }
}

export function getDisplayIdentifier(identifier: IIdentifier | IIdentifier[], ignoreSystem = false) {
  if (!identifier) {
    return '';
  }

  if (identifier instanceof Array && identifier.length > 0) {
    return getDisplayIdentifier(identifier[0], ignoreSystem);
  }

  const obj = <IIdentifier>identifier;
  let value = obj.value;

  if (value) {
    const parts = value.split('|');
    if (parts.length === 2) {
      value = parts[1];
    }
  }

  if (!ignoreSystem && obj.system && value) {
    return `${value} (${obj.system})`;
  } else if (value) {
    return value;
  } else if (!ignoreSystem && obj.system) {
    return obj.system;
  }

  return '';
}

export function parseReference(reference: string): ParsedUrlModel {
  // This regex is loaded with resource types from both STU3 and R4
  const parseReferenceRegex = /(Account|ActivityDefinition|AdverseEvent|AllergyIntolerance|Appointment|AppointmentResponse|AuditEvent|Basic|Binary|BiologicallyDerivedProduct|BodySite|BodyStructure|Bundle|CapabilityStatement|CarePlan|CareTeam|CatalogEntry|ChargeItem|ChargeItemDefinition|Claim|ClaimResponse|ClinicalImpression|CodeSystem|Communication|CommunicationRequest|CompartmentDefinition|Composition|ConceptMap|Condition|Consent|Contract|Coverage|CoverageEligibilityRequest|CoverageEligibilityResponse|DataElement|DetectedIssue|Device|DeviceComponent|DeviceDefinition|DeviceMetric|DeviceRequest|DeviceUseStatement|DiagnosticReport|DocumentManifest|DocumentReference|EffectEvidenceSynthesis|EligibilityRequest|EligibilityResponse|Encounter|Endpoint|EnrollmentRequest|EnrollmentResponse|EpisodeOfCare|EventDefinition|Evidence|EvidenceVariable|ExampleScenario|ExpansionProfile|ExplanationOfBenefit|FamilyMemberHistory|Flag|Goal|GraphDefinition|Group|GuidanceResponse|HealthcareService|ImagingManifest|ImagingStudy|Immunization|ImmunizationEvaluation|ImmunizationRecommendation|ImplementationGuide|InsurancePlan|Invoice|Library|Linkage|List|Location|MeasureReport|Measure|Media|MedicationAdministration|MedicationDispense|MedicationKnowledge|MedicationRequest|MedicationStatement|Medication|MedicinalProduct|MedicinalProductAuthorization|MedicinalProductContraindication|MedicinalProductIndication|MedicinalProductIngredient|MedicinalProductInteraction|MedicinalProductManufactured|MedicinalProductPackaged|MedicinalProductPharmaceutical|MedicinalProductUndesirableEffect|MessageDefinition|MessageHeader|MolecularSequence|NamingSystem|NutritionOrder|Observation|ObservationDefinition|OperationDefinition|OperationOutcome|Organization|OrganizationAffiliation|Parameters|Patient|PaymentNotice|PaymentReconciliation|Person|PlanDefinition|PractitionerRole|Practitioner|Procedure|ProcedureRequest|ProcessRequest|ProcessResponse|Provenance|QuestionnaireResponse|Questionnaire|ReferralRequest|RelatedPerson|RequestGroup|ResearchDefinition|ResearchElementDefinition|ResearchStudy|ResearchSubject|RiskAssessment|RiskEvidenceSynthesis|Schedule|SearchParameter|Sequence|ServiceDefinition|ServiceRequest|Slot|Specimen|SpecimenDefinition|StructureDefinition|StructureMap|Subscription|Substance|SubstancePolymer|SubstanceReferenceInformation|SubstanceSpecification|SupplyDelivery|SupplyRequest|Task|TerminologyCapabilities|TestReport|TestScript|ValueSet|VerificationResult|VisionPrescription)(\/([A-Za-z0-9\-\.]+))?(\/_history\/([A-Za-z0-9\-\.]{1,64}))?/g;
  const match = parseReferenceRegex.exec(reference);

  if (match) {
    return {
      resourceType: match[1],
      id: match[3],
      historyId: match[5]
    };
  }
}



export function getAuthIdIdentifier(authId: string | string[]): string {
  if (!authId) {
    return '';
  }

  if (authId instanceof Array) {
    if (authId.length > 0) {
      return getAuthIdIdentifier(authId[0]);
    }
    return '';
  }

  let value = authId;

  const parts = authId.split('|');
  if (parts.length === 2) {
    value = parts[1];
  }

  return value;
}

export function getAuthIdSource(authId: string | string[]): string {
  if (!authId) {
    return '';
  }

  if (authId instanceof Array) {
    if (authId.length > 0) {
      return getAuthIdSource(authId[0]);
    }
    return '';
  }

  const parts = authId.split('|');

  switch (parts[0]) {
    case 'waad':
      return 'User/Pass';
    case 'google-oauth2':
      return 'Google';
    case 'windowslive':
      return 'Microsoft';
    case 'github':
      return 'GitHub';
    case 'facebook':
      return 'Facebook';
    default:
      return '';
  }

}
