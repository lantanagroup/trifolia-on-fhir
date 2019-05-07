import {ITofUser} from './models/tof-request';
import {Bundle, Practitioner} from '../../../../libs/tof-lib/src/lib/stu3/fhir';

export function createTestUser(userId = 'test.user', name = 'test user', email = 'test@test.com'): ITofUser {
  return {
    clientID: 'test',
    email: email,
    name: name,
    sub: `auth0|${userId}`
  };
}

export function createUserGroupResponse(): Bundle {
  return new Bundle({
    total: 0,
    entry: []
  });
}

export function createUserPractitionerResponse(firstName = 'test', lastName = 'user', id = 'test-user-id', authId = 'test.user'): Bundle {
  return {
    "resourceType": "Bundle",
    "type": "searchset",
    "total": 1,
    "entry": [
      {
        "fullUrl": "http://test.com/fhir/Practitioner/test-user-id",
        "resource": <Practitioner> {
          "resourceType": "Practitioner",
          "id": id,
          "identifier": [
            {
              "system": "https://auth0.com",
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
