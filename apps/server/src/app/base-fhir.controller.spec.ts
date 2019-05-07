import {BaseFhirController} from './base-fhir.controller';
import {Test, TestingModule} from '@nestjs/testing';
import {Controller, HttpModule, HttpService} from '@nestjs/common';
import {ITofUser} from './models/tof-request';
import {Bundle, Practitioner} from '../../../../libs/tof-lib/src/lib/stu3/fhir';
import {ConfigService} from './config.service';
import {createTestUser, createUserGroupResponse, createUserPractitionerResponse} from './test.helper';
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

  public update(fhirServerBase: string, id: string, data: any, user: ITofUser) {
    return super.baseUpdate(fhirServerBase, id, data, user);
  }
}

describe('BaseFhirController', () => {
  let testController: TestController;
  let app: TestingModule;
  const fhirServerBase = 'http://test-fhir-server.com';
  const userPractitionerResponse = createUserPractitionerResponse();
  const userGroupResponse = createUserGroupResponse();
  const testUser = createTestUser();

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
      // every test needs to reset this, since we don't know the order
      // that the tests will be run in.
      mockConfigService.server.enableSecurity = false;
    });

    it('should search without security tags',  async () => {
      const req = nock(fhirServerBase)
        .get('/ImplementationGuide')
        .query({
          '_summary': 'true',
          '_count': '10'
        })
        .reply(200, { responseType: 'Bundle' });

      const results = await testController.search(testUser, fhirServerBase);

      req.done();     // Make sure there are no outstanding requests

      expect(results).toBeTruthy();
    });
  });

  describe('security enabled',  () => {
    beforeEach(() => {
      // every test needs to reset this, since we don't know the order
      // that the tests will be run in.
      mockConfigService.server.enableSecurity = true;
    });

    it('should search with security tags',  async () => {
      const req = nock(fhirServerBase)
        .get('/Practitioner')
        .query({ identifier: 'https://auth0.com|test.user' })
        .reply(200, userPractitionerResponse)
        .get('/Group')
        .query({ member: 'test-user-id', '_summary': 'true' })
        .reply(200, userGroupResponse)
        .get('/ImplementationGuide')
        // This is the purpose of this test... make sure the _security query param
        // is in the search request to the FHIR server
        .query({
          '_summary': 'true',
          '_count': '10',
          '_security': 'everyone^read,user^test-user-id^read'
        })
        .reply(200, { resourceType: 'Bundle' });

      const results = await testController.search(testUser, fhirServerBase);

      req.done();     // Make sure there are no outstanding requests

      expect(results).toBeTruthy();
    });

    it('should succeed when the user has permissions to update', async () => {
      const persistedResource = {
        resourceType: 'ImplementationGuide',
        id: 'test-id',
        meta: {
          security: [{
            code: 'user^test-user-id^write'
          }]
        }
      };
      const resourceUpdates = {
        resourceType: 'ImplementationGuide',
        id: 'test-id',
        meta: {
          security: [{
            code: 'user^test-user-id^write'
          }]
        },
        name: 'test-with-updates'
      };

      const req = nock(fhirServerBase)
        .get('/ImplementationGuide/test-id')
        .reply(200, persistedResource)
        // to check permissions on persisted IG
        .get('/Practitioner')
        .query({ identifier: 'https://auth0.com|test.user' })
        .reply(200, userPractitionerResponse)
        .get('/Group')
        .query({ member: 'test-user-id', '_summary': 'true' })
        .reply(200, userGroupResponse)
        .put('/ImplementationGuide/test-id', resourceUpdates)
        .reply(200, resourceUpdates);

      const results = await testController.update(fhirServerBase, 'test-id', resourceUpdates, testUser);

      expect(results).toBeTruthy();
      expect(results.resourceType).toEqual('ImplementationGuide');
    });
  });
});
