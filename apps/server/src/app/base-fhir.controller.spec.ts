import {BaseFhirController} from './base-fhir.controller';
import {Test, TestingModule} from '@nestjs/testing';
import {Controller, HttpModule, HttpService} from '@nestjs/common';
import {Bundle, DomainResource, ImplementationGuide} from '../../../../libs/tof-lib/src/lib/r4/fhir';
import {ConfigService} from './config.service';
import {createBundle, createTestUser, nockDelete, nockPermissions} from './test.helper';
import {Globals} from '../../../../libs/tof-lib/src/lib/globals';
import {RequestHeaders} from './server.decorators';
// @ts-ignore
import nock = require('nock');
// @ts-ignore
import http = require('axios/lib/adapters/http');
import {ITofUser} from '../../../../libs/tof-lib/src/lib/tof-user';

nock.disableNetConnect();

jest.mock('nanoid/generate', () => () => {
  return 'test-new-id';
});

const mockConfigService = new ConfigService();

@Controller('implementationGuide')
class TestIGController extends BaseFhirController {
  resourceType = 'ImplementationGuide';     // No particular reason to use ImplementationGuide

  constructor(protected httpService: HttpService, protected configService: ConfigService) {
    super(httpService, configService);
  }

  public search(user: ITofUser, fhirServerBase: string, query?: any, @RequestHeaders() headers?) {
    return super.baseSearch(user, fhirServerBase, query, headers);
  }

  public create(user: ITofUser, fhirServerBase: string, data: any) {
    return super.baseCreate(fhirServerBase, 'r4', data, user);
  }

  public update(fhirServerBase: string, id: string, data: any, user: ITofUser) {
    return super.baseUpdate(fhirServerBase, 'r4', id, data, user);
  }

  public delete(fhirServerBase: string, id:  string, user: ITofUser) {
    return super.baseDelete(fhirServerBase, 'r4', id, user);
  }
}

@Controller('structureDefinition')
class TestSDController extends BaseFhirController {
  resourceType = 'StructureDefinition';     // No particular reason to use ImplementationGuide

  constructor(protected httpService: HttpService, protected configService: ConfigService) {
    super(httpService, configService);
  }

  public search(user: ITofUser, fhirServerBase: string, query?: any, @RequestHeaders() headers?) {
    return super.baseSearch(user, fhirServerBase, query, headers);
  }

  public create(user: ITofUser, fhirServerBase: string, data: any) {
    return super.baseCreate(fhirServerBase, 'r4', data, user);
  }

  public update(fhirServerBase: string, id: string, data: any, user: ITofUser) {
    return super.baseUpdate(fhirServerBase, 'r4', id, data, user);
  }

  public delete(fhirServerBase: string, id:  string, user: ITofUser) {
    return super.baseDelete(fhirServerBase, 'r4', id, user);
  }
}

describe('BaseFhirController', () => {
  let testIGController: TestIGController;
  let testSDController: TestSDController;
  let app: TestingModule;
  const fhirServerBase = 'http://test-fhir-server.com';
  const testUser = createTestUser();

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [TestIGController, TestSDController],
      providers: [{
        provide: ConfigService,
        useValue: mockConfigService
      }],
      imports: [HttpModule.register({
        adapter: http
      })]
    }).compile();
    testIGController = app.get<TestIGController>(TestIGController);
    testSDController = app.get<TestSDController>(TestSDController);
  });

  /*
  describe('general', () => {
    it('should error when the resource already exists', async () => {

    });
  });
   */

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

      const results = await testIGController.search(testUser, fhirServerBase);

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

    describe('search', () => {
      it('should have _security in the query params',  async () => {
        const req = nock(fhirServerBase);
        nockPermissions(req);
        req
          .get('/ImplementationGuide')
          // This is the purpose of this test... make sure the _security query param
          // is in the search request to the FHIR server
          .query({
            '_summary': 'true',
            '_count': '10',
            '_security': 'everyone^read,user^test-user-id^read'
          })
          .reply(200, { resourceType: 'Bundle' });

        const results = await testIGController.search(testUser, fhirServerBase);

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

        const req = nock(fhirServerBase);
        nockPermissions(req);
        req
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

        const results = <ImplementationGuide> await testIGController.create(testUser, fhirServerBase, newResource);

        req.done();

        expect(results).toBeTruthy();
        expect(results.id).toBe('test-new-id');
      });

      it('should add read permissions for the user', async () => {
        const newResource = {
          resourceType: 'ImplementationGuide',
          meta: {
            security: [{
              system: Globals.securitySystem,
              code: 'user^test-user-id^write'
            }]
          },
          name: 'test'
        };

        const req = nock(fhirServerBase);
        nockPermissions(req);
        req
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

        const results = <ImplementationGuide> await testIGController.create(testUser, fhirServerBase, newResource);

        req.done();

        expect(results).toBeTruthy();
        expect(results.id).toBe('test-new-id');
      });

      it('should add write permissions for the user', async () => {
        const newResource = {
          resourceType: 'ImplementationGuide',
          meta: {
            security: [{
              system: Globals.securitySystem,
              code: 'user^test-user-id^read'
            }]
          },
          name: 'test'
        };

        const req = nock(fhirServerBase);
        nockPermissions(req);
        req
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

        const results = <ImplementationGuide> await testIGController.create(testUser, fhirServerBase, newResource);

        req.done();

        expect(results).toBeTruthy();
        expect(results.id).toBe('test-new-id');
      });
    });

    describe('delete', () => {
      it('should fail when the user doesn\'t have permissions', async () => {
        const persistedResource = {
          resourceType: 'ImplementationGuide',
          id: 'test-id'
        };

        const req = nock(fhirServerBase);
        nockPermissions(req);
        req
          .get('/ImplementationGuide/test-id')
          .reply(200, persistedResource);

        try {
          await testIGController.delete(fhirServerBase, 'test-id', testUser);
          throw new Error('Expected UnauthorizedException to be thrown.');
        } catch (ex) {
          expect(ex.response).toBeTruthy();
          expect(ex.response.statusCode).toBe(401);
          expect(ex.response.error).toBe('Unauthorized');
        }

        req.done();
      });

      it('should succeed when the user has permissions', async () => {
        const noReferencesBundle = createBundle('searchset', fhirServerBase);
        const persistedResource = {
          resourceType: 'ImplementationGuide',
          id: 'test-id',
          meta: {
            security: [
              { system: Globals.securitySystem, code: 'user^test-user-id^read' },
              { system: Globals.securitySystem, code: 'user^test-user-id^write' }
            ]
          }
        };

        const req = nock(fhirServerBase);
        nockDelete(req, 'ImplementationGuide/test-id', noReferencesBundle, noReferencesBundle);
        nockPermissions(req);
        req
          .get('/ImplementationGuide/test-id')
          .reply(200, persistedResource)
          .delete('/ImplementationGuide/test-id')
          .reply(200);

        await testIGController.delete(fhirServerBase, 'test-id', testUser);

        req.done();
      });

      it('should remove references to the resource and persist before deleting', async () => {
        const refIg = <DomainResource> {
          resourceType: 'ImplementationGuide',
          id: 'test-reference-ig',
          definition: {
            resource: [{
              reference: {
                reference: 'StructureDefinition/test-sd',
                display: 'test sd'
              }
            }]
          }
        };
        const referencesBundle = createBundle('searchset', fhirServerBase, refIg);
        const persistedResource = {
          resourceType: 'StructureDefinition',
          id: 'test-sd',
          meta: {
            security: [
              { system: Globals.securitySystem, code: 'user^test-user-id^read' },
              { system: Globals.securitySystem, code: 'user^test-user-id^write' }
            ]
          }
        };

        const req = nock(fhirServerBase);
        nockDelete(req, 'StructureDefinition/test-sd', referencesBundle, createBundle('searchset', fhirServerBase));
        nockPermissions(req);
        req
          .get('/StructureDefinition/test-sd')
          .reply(200, persistedResource)
          .post('/', (transactionBundle) => {
            expect(transactionBundle).toBeTruthy();
            expect(transactionBundle.resourceType).toBe('Bundle');
            expect(transactionBundle.type).toBe('transaction');
            expect(transactionBundle.entry).toBeTruthy();
            expect(transactionBundle.entry.length).toBe(1);
            expect(transactionBundle.entry[0].resource).toBeTruthy();
            expect(transactionBundle.entry[0].resource.resourceType).toBe('ImplementationGuide');

            // Expect the request for the entry to be for an update to the IG
            expect(transactionBundle.entry[0].request).toBeTruthy();
            expect(transactionBundle.entry[0].request.method).toBe('PUT');
            expect(transactionBundle.entry[0].request.url).toBe('ImplementationGuide/test-reference-ig');

            // Make sure the IG is modified
            const ig = <ImplementationGuide> transactionBundle.entry[0].resource;
            expect(ig.definition).toBeTruthy();
            expect(ig.definition.resource).toBeTruthy();
            expect(ig.definition.resource.length).toBe(0);

            return true;
          })
          .reply(200)
          .delete('/StructureDefinition/test-sd')
          .reply(200);

        await testSDController.delete(fhirServerBase, 'test-sd', testUser);

        req.done();
      });
    });

    describe('update', () => {
      it('should fail when the user doesn\'t have permissions in the resource their updating', async () => {
        const resourceUpdates = {
          resourceType: 'ImplementationGuide',
          id: 'test-id',
          name: 'test-with-updates'
        };

        const req = nock(fhirServerBase);
        nockPermissions(req);

        try {
          await testIGController.update(fhirServerBase, 'test-id', resourceUpdates, testUser);
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
              system: Globals.securitySystem,
              code: 'user^test-user-id^write'
            }]
          }
        };
        const resourceUpdates = {
          resourceType: 'ImplementationGuide',
          id: 'test-id',
          meta: {
            security: [{
              system: Globals.securitySystem,
              code: 'user^test-user-id^write'
            }]
          },
          name: 'test-with-updates'
        };

        const req = nock(fhirServerBase);
        nockPermissions(req);
        req
          .get('/ImplementationGuide/test-id')
          .reply(200, persistedResource)
          .put('/ImplementationGuide/test-id', resourceUpdates)
          .reply(200, resourceUpdates)
          .get('/ImplementationGuide/test-id')
          .reply(200, resourceUpdates);

        const results = await testIGController.update(fhirServerBase, 'test-id', resourceUpdates, testUser);

        req.done();

        expect(results).toBeTruthy();
        expect(results.resourceType).toEqual('ImplementationGuide');
      });
    });
  });
});
