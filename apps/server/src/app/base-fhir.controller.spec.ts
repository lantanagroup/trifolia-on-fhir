import {BaseFhirController} from './base-fhir.controller';
import {Test, TestingModule} from '@nestjs/testing';
import {Controller, HttpModule, HttpService} from '@nestjs/common';
import {ITofUser} from './models/tof-request';
import {Bundle, ImplementationGuide, Practitioner} from '../../../../libs/tof-lib/src/lib/stu3/fhir';
import {ConfigService} from './config.service';
import {createTestUser, createUserGroupResponse, createUserPractitionerResponse} from './test.helper';
import nock = require('nock');
import http = require('axios/lib/adapters/http');

nock.disableNetConnect();

jest.mock('nanoid', () => () => {
  return 'test-new-id';
});

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

  public create(user: ITofUser, fhirServerBase: string, data: any) {
    return super.baseCreate(fhirServerBase, data, user);
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

    /*
    it('should error when the resource already exists', async () => {

    });
     */
  });

  describe('security enabled',  () => {
    beforeEach(() => {
      // every test needs to reset this, since we don't know the order
      // that the tests will be run in.
      mockConfigService.server.enableSecurity = true;
    });

    describe('search', () => {
      it('should have _security in the query params',  async () => {
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
    });

    describe('create', () => {
      it('should add read/write permissions for the user', async () => {
        const newResource = {
          resourceType: 'ImplementationGuide',
          name: 'test'
        };

        const req = nock(fhirServerBase)
          // to check permissions on persisted IG
          .get('/Practitioner')
          .query({ identifier: 'https://auth0.com|test.user' })
          .reply(200, userPractitionerResponse)
          .get('/Group')
          .query({ member: 'test-user-id', '_summary': 'true' })
          .reply(200, userGroupResponse)
          // Request to FHIR server to update the resource
          .put('/ImplementationGuide/test-new-id', (body: ImplementationGuide) => {
            expect(body).toBeTruthy();
            expect(body.meta).toBeTruthy();
            expect(body.meta.security).toBeTruthy();
            expect(body.meta.security.length).toBe(2);    // both read and write
            expect(body.meta.security[0].code).toBe('user^test-user-id^read');
            expect(body.meta.security[1].code).toBe('user^test-user-id^write');
            return true;
          })
          .reply(201, newResource, {
            'Content-Location': `${fhirServerBase}/ImplementationGuide/test-new-id/_history/1`
          })
          // Request to FHIR server after the resource has been updated
          .get('/ImplementationGuide/test-new-id/_history/1')
          .reply(200, {
            resourceType: 'ImplementationGuide',
            id: 'test-new-id',
            name: 'test'
          });

        const results = <ImplementationGuide> await testController.create(testUser, fhirServerBase, newResource);

        req.done();

        expect(results).toBeTruthy();
        expect(results.id).toBe('test-new-id');
      });

      it('should add read permissions for the user', async () => {
        const newResource = {
          resourceType: 'ImplementationGuide',
          meta: {
            security: [{
              code: 'user^test-user-id^write'
            }]
          },
          name: 'test'
        };

        const req = nock(fhirServerBase)
        // to check permissions on persisted IG
          .get('/Practitioner')
          .query({ identifier: 'https://auth0.com|test.user' })
          .reply(200, userPractitionerResponse)
          .get('/Group')
          .query({ member: 'test-user-id', '_summary': 'true' })
          .reply(200, userGroupResponse)
          // Request to FHIR server to update the resource
          .put('/ImplementationGuide/test-new-id', (body: ImplementationGuide) => {
            expect(body).toBeTruthy();
            expect(body.meta).toBeTruthy();
            expect(body.meta.security).toBeTruthy();
            expect(body.meta.security.length).toBe(2);    // both read and write
            expect(body.meta.security[0].code).toBe('user^test-user-id^write');
            expect(body.meta.security[1].code).toBe('user^test-user-id^read');
            return true;
          })
          .reply(201, newResource, {
            'Content-Location': `${fhirServerBase}/ImplementationGuide/test-new-id/_history/1`
          })
          // Request to FHIR server after the resource has been updated
          .get('/ImplementationGuide/test-new-id/_history/1')
          .reply(200, {
            resourceType: 'ImplementationGuide',
            id: 'test-new-id',
            name: 'test'
          });

        const results = <ImplementationGuide> await testController.create(testUser, fhirServerBase, newResource);

        req.done();

        expect(results).toBeTruthy();
        expect(results.id).toBe('test-new-id');
      });

      it('should add write permissions for the user', async () => {
        const newResource = {
          resourceType: 'ImplementationGuide',
          meta: {
            security: [{
              code: 'user^test-user-id^read'
            }]
          },
          name: 'test'
        };

        const req = nock(fhirServerBase)
          // to check permissions on persisted IG
          .get('/Practitioner')
          .query({ identifier: 'https://auth0.com|test.user' })
          .reply(200, userPractitionerResponse)
          .get('/Group')
          .query({ member: 'test-user-id', '_summary': 'true' })
          .reply(200, userGroupResponse)
          // Request to FHIR server to update the resource
          .put('/ImplementationGuide/test-new-id', (body: ImplementationGuide) => {
            expect(body).toBeTruthy();
            expect(body.meta).toBeTruthy();
            expect(body.meta.security).toBeTruthy();
            expect(body.meta.security.length).toBe(2);    // both read and write
            expect(body.meta.security[0].code).toBe('user^test-user-id^read');
            expect(body.meta.security[1].code).toBe('user^test-user-id^write');
            return true;
          })
          .reply(201, newResource, {
            'Content-Location': `${fhirServerBase}/ImplementationGuide/test-new-id/_history/1`
          })
          // Request to FHIR server after the resource has been updated
          .get('/ImplementationGuide/test-new-id/_history/1')
          .reply(200, {
            resourceType: 'ImplementationGuide',
            id: 'test-new-id',
            name: 'test'
          });

        const results = <ImplementationGuide> await testController.create(testUser, fhirServerBase, newResource);

        req.done();

        expect(results).toBeTruthy();
        expect(results.id).toBe('test-new-id');
      });
    });

    describe('update', () => {
      it('should fail when the user doesn\'t have permissions', async () => {
        const resourceUpdates = {
          resourceType: 'ImplementationGuide',
          id: 'test-id',
          name: 'test-with-updates'
        };

        const req = nock(fhirServerBase)
          // to check permissions on persisted IG
          .get('/Practitioner')
          .query({ identifier: 'https://auth0.com|test.user' })
          .reply(200, userPractitionerResponse)
          .get('/Group')
          .query({ member: 'test-user-id', '_summary': 'true' })
          .reply(200, userGroupResponse);

        try {
          await testController.update(fhirServerBase, 'test-id', resourceUpdates, testUser);
          throw new Error('Expected UnauthorizedException to be thrown.');
        } catch (ex) {
          expect(ex.response).toBeTruthy();
          expect(ex.response.statusCode).toBe(401);
          expect(ex.response.error).toBe('Unauthorized');
        }

        req.done();
      });

      it('should succeed when the user has permissions', async () => {
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

        req.done();

        expect(results).toBeTruthy();
        expect(results.resourceType).toEqual('ImplementationGuide');
      });
    });
  });
});
