import {BaseFhirController} from './base-fhir.controller';
import {Test, TestingModule} from '@nestjs/testing';
import {Controller, HttpModule, HttpService} from '@nestjs/common';
import {ITofUser} from './models/tof-request';
import {Bundle, Practitioner} from '../../../../libs/tof-lib/src/lib/stu3/fhir';
import {ConfigService} from './config.service';
import nock = require('nock');
import http = require('axios/lib/adapters/http');

nock.disableNetConnect();

const mockConfigService = new ConfigService();

@Controller('test')
class TestController extends BaseFhirController {
  resourceType = 'ImplementationGuide';     // No particular reason to use ImplementationGuide

  constructor(protected httpService: HttpService, protected configService: ConfigService) {
    super(httpService, configService);
  }

  public search(user: ITofUser, fhirServerBase: string, query?: any) {
    return super.baseSearch(user, fhirServerBase, query);
  }
}

describe('BaseFhirController', () => {
  let testController: TestController;
  let app: TestingModule;
  const userPractitionerResponse = {
    "resourceType": "Bundle",
    "type": "searchset",
    "total": 1,
    "entry": [
      {
        "fullUrl": "http://test.com/fhir/Practitioner/test-user-id",
        "resource": <Practitioner> {
          "resourceType": "Practitioner",
          "id": "test-user-id",
          "identifier": [
            {
              "system": "https://auth0.com",
              "value": "test.user"
            }
          ],
          "name": [
            {
              "family": "User",
              "given": [
                "Test"
              ]
            }
          ]
        }
      }
    ]
  };
  const userGroupResponse = new Bundle({
    total: 0,
    entry: []
  });
  const testUser: ITofUser = {
    clientID: 'test',
    email: 'test@test.com',
    name: 'test user',
    sub: 'auth0|test.user'
  };

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [TestController],
      providers: [{
        provide: ConfigService,
        useValue: mockConfigService
      }],
      imports: [HttpModule.register({
        adapter: http
      })]
    }).compile();
    testController = app.get<TestController>(TestController);
  });

  describe('security disabled', () => {
    beforeEach(() => {
      mockConfigService.server.enableSecurity = false;
    });

    it('should search without security tags',  (done) => {
      testController.search(testUser, 'http://test.com/fhir')
        .then(() => done())
        .catch((err) => done(err));

      nock('http://test.com')
        .get('/fhir/Practitioner')
        .query({ identifier: 'https://auth0.com|test.user' })
        .reply(200, userPractitionerResponse)
        .get('/fhir/Group')
        .query({ member: 'test-user-id', '_summary': 'true' })
        .reply(200, userGroupResponse)
        .get('/fhir/ImplementationGuide')
        .query({
          '_summary': 'true',
          '_count': '10'
        })
        .reply(200, { responseType: 'Bundle' });
    });
  });

  describe('security enabled',  () => {
    beforeEach(() => {
      mockConfigService.server.enableSecurity = true;
    });

    it('should search with security tags',  (done) => {
      testController.search(testUser, 'http://test.com/fhir')
        .then(() => done())
        .catch((err) => done(err));

      nock('http://test.com')
        .get('/fhir/Practitioner')
        .query({ identifier: 'https://auth0.com|test.user' })
        .reply(200, userPractitionerResponse)
        .get('/fhir/Group')
        .query({ member: 'test-user-id', '_summary': 'true' })
        .reply(200, userGroupResponse)
        .get('/fhir/ImplementationGuide')
        // This is the purpose of this test... make sure the _security query param
        // is in the search request to the FHIR server
        .query({
          '_summary': 'true',
          '_count': '10',
          '_security': 'everyone^read,user^test-user-id^read'
        })
        .reply(200, { resourceType: 'Bundle' });
    });
  });
});
