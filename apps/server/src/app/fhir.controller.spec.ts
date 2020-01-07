import {Test, TestingModule} from '@nestjs/testing';
import {FhirController} from './fhir.controller';
import {HttpModule} from '@nestjs/common';
import {ConfigService} from './config.service';
import {createBundle, createTestUser, nockDelete, nockPermissions} from './test.helper';
import {addPermission} from '../../../../libs/tof-lib/src/lib/helper';
import {Bundle, Observation, StructureDefinition} from '../../../../libs/tof-lib/src/lib/stu3/fhir';
import {Globals} from '../../../../libs/tof-lib/src/lib/globals';
// @ts-ignore
import nock = require('nock');
// @ts-ignore
import http = require('axios/lib/adapters/http');

jest.mock('nanoid/generate', () => () => {
  return 'test-new-id';
});

nock.disableNetConnect();

const fhirServerBase = 'http://test-fhir-server.com';


describe('FhirController', () => {
  let app: TestingModule;
  let controller: FhirController;
  const testUser = createTestUser();
  const configService = new ConfigService();

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [FhirController],
      providers: [{
        provide: ConfigService,
        useValue: configService
      }],
      imports: [HttpModule.register({
        adapter: http
      })]
    }).compile();
    controller = app.get<FhirController>(FhirController);
  });

  describe('change-id', () => {

    beforeEach(() => {
      configService.server.enableSecurity = false;
      nock.cleanAll();
    });

    it('should change the id of a resource', async () => {
      const persistedResource = new StructureDefinition({
        resourceType: 'StructureDefinition',
        id: 'test',
        meta: {}
      });

      addPermission(persistedResource.meta, 'everyone', 'write');

      const req = nock(fhirServerBase)
        .get('/StructureDefinition/test')
        .reply(200, persistedResource)
        .get('/ImplementationGuide?resource=StructureDefinition%2Ftest')
        .reply(200, persistedResource)
        .get('/ImplementationGuide?global=StructureDefinition%2Ftest')
        .reply(200, persistedResource)
        .put('/StructureDefinition/new-test-id')
        .reply(200)
        .delete('/StructureDefinition/test')
        .reply(200);

      const results = await controller.changeId(fhirServerBase, 'StructureDefinition', 'test', 'new-test-id', testUser, 'r4');

      req.done();
      expect(results).toBeTruthy();
    });
  });

  describe('proxy', () => {
    describe('security disabled', () => {
      beforeEach(() => {
        nock.cleanAll();
        configService.server.enableSecurity = false;
      });

      it('should post/create a single resource', async () => {
        const observation = {
          resourceType: 'Observation',
          status: 'final'
        };

        const replyHeaders = {
          'content-location': fhirServerBase + '/Observation/new-id/_history/1'
        };
        const postedResource = {
          resourceType: 'Observation',
          id: 'new-id',
          status: 'final'
        };

        const req = nock(fhirServerBase)
          .post('/Observation', observation)
          .reply(201, postedResource, replyHeaders);

        const results = await controller.proxy('/Observation', {}, 'POST', fhirServerBase, 'r4', testUser, observation);

        expect(results).toBeTruthy();

        req.done();
      });

      it('should put/update a single resource', async () => {
        const updatedObservation = {
          resourceType: 'Observation',
          id: 'test-id',
          status: 'final'
        };
        const replyHeaders = {
          'content-location': fhirServerBase + '/Observation/new-id/_history/2'
        };

        const req = nock(fhirServerBase)
          .put('/Observation/test-id', updatedObservation)
          .reply(201, updatedObservation, replyHeaders);

        const results = await controller.proxy('/Observation/test-id', {}, 'PUT', fhirServerBase, 'r4', testUser, updatedObservation);

        expect(results).toBeTruthy();

        req.done();
      });

      it('should delete a single resource', async () => {
        const replyHeaders = {
          'content-location': fhirServerBase + '/Observation/new-id/_history/3'
        };

        const req = nock(fhirServerBase);
        nockDelete(req, 'Observation/test-id', createBundle('searchset', fhirServerBase), createBundle('searchset', fhirServerBase));
        req
          .delete('/Observation/test-id')
          .reply(201, null, replyHeaders);

        const results = await controller.proxy('/Observation/test-id', {}, 'DELETE', fhirServerBase, 'r4', testUser);

        expect(results).toBeTruthy();

        req.done();
      });

      it('should post and put resource entries in the batch', async () => {
        const batchBundle: Bundle = {
          resourceType: 'Bundle',
          type: 'batch',
          entry: [{
            resource: <Observation> {
              resourceType: 'Observation',
              status: 'final'
            },
            request: {
              method: 'POST',
              url: '/Observation'
            }
          }, {
            resource: <Observation> {
              resourceType: 'Observation',
              status: 'final',
              id: 'test-obs-1'
            },
            request: {
              method: 'PUT',
              url: '/Observation/test-obs-1'
            }
          }]
        };

        const req = nock(fhirServerBase)
          .post('/Observation', (obs) => {
            expect(obs).toBeTruthy();
            expect(obs.resourceType).toBe('Observation');
            expect(obs.id).toBe('test-new-id');
            return true;
          })
          .reply(201, { resourceType: 'Observation' }, { 'content-location': 'http://test-fhir-server.com/Observation/test-new-id/_history/1' })
          .put('/Observation/test-obs-1', (obs) => {
            expect(obs).toBeTruthy();
            expect(obs.resourceType).toBe('Observation');
            expect(obs.id).toBe('test-obs-1');
            return true;
          })
          .reply(200, { resourceType: 'Observation' }, { 'content-location': 'http://test-fhir-server.com/Observation/test-obs-1/_history/2' });

        const results = await controller.proxy('/', { }, 'POST', fhirServerBase, 'r4', testUser, batchBundle);

        expect(results).toBeTruthy();
        expect(results.data).toBeTruthy();
        expect(results.data.entry).toBeTruthy();
        expect(results.data.entry.length).toBe(2);
        expect(results.data.entry[0].request).toBeTruthy();
        expect(results.data.entry[0].request.method).toBe('POST');
        expect(results.data.entry[0].request.url).toBe('/Observation');
        expect(results.data.entry[0].response).toBeTruthy();
        expect(results.data.entry[0].response.status).toBe('201');
        expect(results.data.entry[0].response.location).toBe('http://test-fhir-server.com/Observation/test-new-id/_history/1');
        expect(results.data.entry[1].request).toBeTruthy();
        expect(results.data.entry[1].request.method).toBe('PUT');
        expect(results.data.entry[1].request.url).toBe('/Observation/test-obs-1');
        expect(results.data.entry[1].response).toBeTruthy();
        expect(results.data.entry[1].response.status).toBe('200');
        expect(results.data.entry[1].response.location).toBe('http://test-fhir-server.com/Observation/test-obs-1/_history/2');

        req.done();
      });

      it('should handle server response errors for individual entries in a batch', async () => {
        const batchBundle: Bundle = {
          resourceType: 'Bundle',
          type: 'batch',
          entry: [{
            resource: <Observation> {
              resourceType: 'Observation',
              status: 'final'
            },
            request: {
              method: 'POST',
              url: '/Observation'
            }
          }, {
            resource: <Observation> {
              resourceType: 'Observation',
              status: 'final',
              id: 'test-obs-1'
            },
            request: {
              method: 'PUT',
              url: '/Observation/test-obs-1'
            }
          }]
        };

        const req = nock(fhirServerBase)
          .post('/Observation', (obs) => {
            expect(obs).toBeTruthy();
            expect(obs.resourceType).toBe('Observation');
            expect(obs.id).toBe('test-new-id');
            return true;
          })
          .reply(400, { resourceType: 'OperationOutcome' })
          .put('/Observation/test-obs-1', (obs) => {
            expect(obs).toBeTruthy();
            expect(obs.resourceType).toBe('Observation');
            expect(obs.id).toBe('test-obs-1');
            return true;
          })
          .reply(200, { resourceType: 'Observation' }, { 'content-location': 'http://test-fhir-server.com/Observation/test-obs-1/_history/2' });

        const results = await controller.proxy('/', { }, 'POST', fhirServerBase, 'r4', testUser, batchBundle);

        expect(results).toBeTruthy();
        expect(results.data).toBeTruthy();
        expect(results.data.entry).toBeTruthy();
        expect(results.data.entry.length).toEqual(2);
        expect(results.data.entry[0].response).toBeTruthy();
        expect(results.data.entry[0].response.location).toBeFalsy();
        expect(results.data.entry[0].response.status).toEqual('400');
        expect(results.data.entry[0].response.outcome).toBeTruthy();
        expect(results.data.entry[1].response).toBeTruthy();
        expect(results.data.entry[1].response.status).toEqual('200');
        expect(results.data.entry[1].response.location).toEqual('http://test-fhir-server.com/Observation/test-obs-1/_history/2');

        req.done();
      });
    });

    describe('security enabled', () => {
      beforeEach(() => {
        nock.cleanAll();
        configService.server.enableSecurity = true;
      });

      it('should make sure resource retrieval checks security for entry in batch', async () => {
        const persistedObs = {
          resourceType: 'Observation',
          meta: {
            security: [
              { system: Globals.securitySystem, code: 'everyone^read' },
              { system: Globals.securitySystem, code: 'everyone^write' }
            ]
          },
          id: 'test-obs-1'
        };
        const batchBundle: Bundle = {
          resourceType: 'Bundle',
          type: 'batch',
          entry: [{
            resource: <Observation> {
              resourceType: 'Observation',
              meta: {
                security: [
                  { code: 'everyone^read' },
                  { code: 'everyone^write' }
                ]
              },
              status: 'final',
              id: 'test-obs-1'
            },
            request: {
              method: 'PUT',
              url: '/Observation/test-obs-1'
            }
          }]
        };

        const req = nock(fhirServerBase);
        nockPermissions(req);
        req
          .get('/Observation/test-obs-1')
          .reply(200, persistedObs)
          .put('/Observation/test-obs-1', (obs) => {
            expect(obs).toBeTruthy();
            expect(obs.resourceType).toBe('Observation');
            expect(obs.id).toBe('test-obs-1');
            return true;
          })
          .reply(200);

        const results = await controller.proxy('/', { }, 'POST', fhirServerBase, 'r4', testUser, batchBundle);

        expect(results).toBeTruthy();

        req.done();
      });

      it('should call $meta-delete for removed permission and replace with user permission', async () => {
        const persistedObs = {
          resourceType: 'Observation',
          meta: {
            security: [
              { system: Globals.securitySystem, code: 'everyone^read' },
              { system: Globals.securitySystem, code: 'everyone^write' }
            ]
          },
          id: 'test-obs-1'
        };
        const batchBundle: Bundle = {
          resourceType: 'Bundle',
          type: 'batch',
          entry: [{
            resource: <Observation> {
              resourceType: 'Observation',
              status: 'final',
              id: 'test-obs-1'
            },
            request: {
              method: 'PUT',
              url: '/Observation/test-obs-1'
            }
          }]
        };

        let deleteMetaCount = 1;
        const req = nock(fhirServerBase)
          .persist();
        nockPermissions(req);
        req
          .get('/Observation/test-obs-1')
          .reply(200, persistedObs)
          .post('/Observation/test-obs-1/$meta-delete', (metaDelete) => {
            expect(metaDelete).toBeTruthy();
            expect(metaDelete.resourceType).toBe('Parameters');
            expect(metaDelete.parameter).toBeTruthy();
            expect(metaDelete.parameter.length).toBe(1);
            expect(metaDelete.parameter[0].name).toBe('meta');
            expect(metaDelete.parameter[0].valueMeta).toBeTruthy();
            expect(metaDelete.parameter[0].valueMeta.security).toBeTruthy();

            // The first time this is called, it should be to delete everyone^read
            // The second time this is called, it should be to delete everyone^write
            if (deleteMetaCount === 1) {
              expect(metaDelete.parameter[0].valueMeta.security.code).toBe('everyone^read');
            } else {
              expect(metaDelete.parameter[0].valueMeta.security.code).toBe('everyone^write');
            }

            deleteMetaCount++;
            return true;
          })
          .twice()
          .reply(200)
          .put('/Observation/test-obs-1', (obs) => {
            expect(obs).toBeTruthy();
            expect(obs.resourceType).toBe('Observation');
            expect(obs.id).toBe('test-obs-1');
            return true;
          })
          .reply(200);

        const results = await controller.proxy('/', { }, 'POST', fhirServerBase, 'r4', testUser, batchBundle);

        expect(results).toBeTruthy();

        req.done();
      });

      it('should make sure searches have _security query param', async () => {
        const req = nock(fhirServerBase);
        nockPermissions(req);
        req
          .get('/ImplementationGuide')
          // The purpose of this test is here... to make sure that the _security
          // query parameter is added to the request to the FHIR server's search
          .query({
            _security: 'everyone^read,user^test-user-id^read'
          })
          .reply(200, { resourceType: 'Bundle' });

        const results = await controller.proxy('/ImplementationGuide', {}, 'GET', fhirServerBase, 'r4', testUser);

        expect(results).toBeTruthy();
        expect(results.contentType).toBeTruthy();

        req.done();
      });

      it('should make sure a create adds permissions for the user', async () => {
        const newObservation = {
          resourceType: 'Observation',
          status: 'final'
        };

        const replyHeaders = {
          'content-location': fhirServerBase + '/Observation/new-id/_history/1'
        };
        const postedResource = {
          resourceType: 'Observation',
          id: 'new-id',
          status: 'final'
        };

        const req = nock(fhirServerBase);
        nockPermissions(req);
        req
          .post('/Observation', (observation) => {
            expect(observation).toBeTruthy();
            expect(observation.meta).toBeTruthy();
            expect(observation.meta.security).toBeTruthy();
            expect(observation.meta.security.length).toBe(2);
            expect(observation.meta.security[0].code).toBe('user^test-user-id^read');
            expect(observation.meta.security[1].code).toBe('user^test-user-id^write');
            return true;
          })
          .reply(201, postedResource, replyHeaders);

        const results = await controller.proxy('/Observation', {}, 'POST', fhirServerBase, 'r4', testUser, newObservation);

        expect(results).toBeTruthy();

        req.done();
      });

      it('should succeed to update when user has permissions', async () => {
        const persistedObservation = {
          resourceType: 'Observation',
          meta: {
            security: [
              { code: 'everyone^read' },
              { code: 'everyone^write' }
            ]
          },
          id: 'test-id',
          status: 'draft'
        };
        const updatedObservation = {
          resourceType: 'Observation',
          id: 'test-id',
          status: 'final'
        };
        const replyHeaders = {
          'content-location': fhirServerBase + '/Observation/new-id/_history/2'
        };

        const req = nock(fhirServerBase);
        nockPermissions(req);
        req
          .put('/Observation/test-id', (puttedObservation) => {
            expect(puttedObservation).toBeTruthy();
            expect(puttedObservation.meta).toBeTruthy();
            expect(puttedObservation.meta.security).toBeTruthy();
            expect(puttedObservation.meta.security.length).toBe(2);
            expect(puttedObservation.meta.security[0].code).toBe('user^test-user-id^read');
            expect(puttedObservation.meta.security[1].code).toBe('user^test-user-id^write');
            return true;
          })
          .reply(201, persistedObservation, replyHeaders);

        const results = await controller.proxy('/Observation/test-id', {}, 'PUT', fhirServerBase, 'r4', testUser, updatedObservation);

        expect(results).toBeTruthy();

        req.done();
      });

      it('should fail to update when user does not have permissions', async () => {
        const persistedObservation = {
          resourceType: 'Observation',
          id: 'test-id',
          status: 'draft'
        };
        const updatedObservation = {
          resourceType: 'Observation',
          id: 'test-id',
          status: 'final'
        };

        const req = nock(fhirServerBase);
        nockPermissions(req);
        req
          .get('/Observation/test-id')
          .reply(200, persistedObservation);

        try {
          await controller.proxy('/Observation/test-id', {}, 'PUT', fhirServerBase, 'r4', testUser, updatedObservation);
          throw new Error('Proxy should have thrown an AuthorizationException');
        } catch (ex) {
          expect(ex.status).toBe(401);
        }

        req.done();
      });

      it('should succeed deleting when user has permissions', async () => {
        const persistedObservation = {
          resourceType: 'Observation',
          meta: {
            security: [
              { system: Globals.securitySystem, code: 'user^test-user-id^read' },
              { system: Globals.securitySystem, code: 'user^test-user-id^write' }
            ]
          },
          id: 'test-id',
          status: 'draft'
        };

        const req = nock(fhirServerBase);
        nockDelete(req, 'Observation/test-id', createBundle('searchset', fhirServerBase), createBundle('searchset', fhirServerBase));
        nockPermissions(req);
        req
          .get('/Observation/test-id')
          .reply(200, persistedObservation)
          .delete('/Observation/test-id')
          .reply(200);

        await controller.proxy('/Observation/test-id', {}, 'DELETE', fhirServerBase, 'r4', testUser);

        req.done();
      });

      it('should fail deleting when user does not have permissions', async () => {
        const persistedObservation = {
          resourceType: 'Observation',
          id: 'test-id',
          status: 'draft'
        };

        const req = nock(fhirServerBase);
        nockPermissions(req);
        req
          .get('/Observation/test-id')
          .reply(200, persistedObservation);

        try {
          await controller.proxy('/Observation/test-id', {}, 'DELETE', fhirServerBase, 'r4', testUser);
        } catch (ex) {
          expect(ex.status).toBe(401);
        }

        req.done();
      });
    });
  });
});
