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
import nock from 'nock';
import EventEmitter = NodeJS.EventEmitter;

export function createTestUser(userId = 'test.user', name = 'test user', email = 'test@test.com', isAdmin = false): ITofUser {
  return {
    email: email,
    name: name,
    sub: `auth0|${userId}`,
    isAdmin: isAdmin
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

export function nockPermissions(nockReq: nock.Scope, authUserId = 'test.user', internalUserId = 'test-user-id', userPractitionerResponse?, userGroupResponse?) {
  return nockReq
    .get('/Practitioner')
    .query({ identifier: Globals.authNamespace + '|' + authUserId })
    .reply(200, userPractitionerResponse || createUserPractitionerResponse)
    .get('/Group')
    .query({ member: internalUserId, '_summary': 'true' })
    .reply(200, userGroupResponse || createUserGroupResponse);
}

export function nockDelete(nockReq: nock.Scope, resourceReference: string, igResourceResponse, igGlobalResponse) {
  return nockReq
    // search for implementation guides that reference it via "resource" search param
    .get('/ImplementationGuide')
    .query({ resource: resourceReference})
    .reply(200, igResourceResponse)
    // search for implementation guides that reference it via "global" search param
    .get('/ImplementationGuide')
    .query({ global: resourceReference})
    .reply(200, igGlobalResponse);
}
