import {ITofUser} from './models/tof-request';
import {BundleTypes as STU3BundleTypes, Bundle as STU3Bundle, DomainResource as STU3DomainResource} from '../../../../libs/tof-lib/src/lib/stu3/fhir';
import {
  BundleTypes as R4BundleTypes,
  Bundle as R4Bundle,
  Practitioner as R4Practitioner,
  DomainResource as R4DomainResource,
  BundleEntryComponent
} from '../../../../libs/tof-lib/src/lib/r4/fhir';
import {Globals} from '../../../../libs/tof-lib/src/lib/globals';
import {buildUrl} from '../../../../libs/tof-lib/src/lib/fhirHelper';

export function createTestUser(userId = 'test.user', name = 'test user', email = 'test@test.com'): ITofUser {
  return {
    clientID: 'test',
    email: email,
    name: name,
    sub: `auth0|${userId}`
  };
}

export function createUserGroupResponse(): STU3Bundle | R4Bundle {
  return new R4Bundle({
    total: 0,
    entry: []
  });
}

export function createUserPractitionerResponse(firstName = 'test', lastName = 'user', id = 'test-user-id', authId = 'test.user'): STU3Bundle | R4Bundle {
  return {
    "resourceType": "Bundle",
    "type": "searchset",
    "total": 1,
    "entry": [
      {
        "fullUrl": "http://test.com/fhir/Practitioner/test-user-id",
        "resource": <R4Practitioner> {
          "resourceType": "Practitioner",
          "id": id,
          "identifier": [
            {
              "system": Globals.authNamespace,
              "value": authId
            }
          ],
          "name": [
            {
              "family": lastName,
              "given": [firstName]
            }
          ]
        }
      }
    ]
  };
}

export function createBundle(type: STU3BundleTypes | R4BundleTypes, baseUrl: string, ...resources: (STU3DomainResource|R4DomainResource)[]): STU3Bundle | R4Bundle {
  const entries: BundleEntryComponent[] = resources.map(resource => {
    const entry = <BundleEntryComponent> {
      resource: resource
    };

    if (baseUrl) {
      entry.fullUrl = buildUrl(baseUrl, resource.resourceType, resource.id);
    }

    return entry;
  });

  return <R4Bundle> {
    resourceType: 'Bundle',
    type: type,
    total: resources.length,
    entry: entries
  };
}
