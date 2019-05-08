import {Test, TestingModule} from '@nestjs/testing';
import {FhirController} from './fhir.controller';
import {HttpModule} from '@nestjs/common';
import {ConfigService} from './config.service';
import {createTestUser, createUserGroupResponse, createUserPractitionerResponse} from './test.helper';
import {addPermission} from '../../../../libs/tof-lib/src/lib/helper';
import {Bundle, Observation, StructureDefinition} from '../../../../libs/tof-lib/src/lib/stu3/fhir';
import {Response} from 'express';

import nock = require('nock');
import http = require('axios/lib/adapters/http');

jest.mock('nanoid', () => () => {
  return 'test-new-id';
});

nock.disableNetConnect();

const fhirServerBase = 'http://test-fhir-server.com';
const userPractitionerResponse = createUserPractitionerResponse();
const userGroupResponse = createUserGroupResponse();
const testUser = createTestUser();

describe('FhirController', () => {
  let app: TestingModule;
  let controller: FhirController;
  const userPractitionerResponse = createUserPractitionerResponse();
  const userGroupResponse = createUserGroupResponse();
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
        .put('/StructureDefinition/new-test-id')
        .reply(200)
        .delete('/StructureDefinition/test')
        .reply(200);

      const results = await controller.changeId(fhirServerBase, 'StructureDefinition', 'test', 'new-test-id', testUser);

      req.done();

      expect(results).toBeTruthy();
    });
  });

  describe('proxy', () => {
    describe('security disabled', () => {
      let isSent, contentTypeSet, statusSet;
      const response = <Response> <any> {
        status: () => { statusSet = true; },
        contentType: () => { contentTypeSet = true; },
        send: () => { isSent = true; }
      };

      beforeEach(() => {
        nock.cleanAll();
        configService.server.enableSecurity = false;
        isSent = false;
        contentTypeSet = false;
        statusSet = false;
      });

      it('should post and put resource entries in the transaction', async () => {
        const transactionBundle: Bundle = {
          resourceType: 'Bundle',
          type: 'transaction',
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
          .reply(201)
          .put('/Observation/test-obs-1', (obs) => {
            expect(obs).toBeTruthy();
            expect(obs.resourceType).toBe('Observation');
            expect(obs.id).toBe('test-obs-1');
            return true;
          })
          .reply(200);

        await controller.proxy('/', { }, 'POST', fhirServerBase, response, testUser, transactionBundle);

        req.done();
      });
    });

    describe('security enabled', () => {
      let isSent, contentTypeSet, statusSet;
      const response = <Response> <any> {
        status: () => { statusSet = true; },
        contentType: () => { contentTypeSet = true; },
        send: () => { isSent = true; }
      };

      beforeEach(() => {
        nock.cleanAll();
        configService.server.enableSecurity = true;
        isSent = false;
        contentTypeSet = false;
        statusSet = false;
      });

      it('should make sure resource retrieval checks security for entry in transaction', async () => {
        const persistedObs = {
          resourceType: 'Observation',
          meta: {
            security: [
              { code: 'everyone^read' },
              { code: 'everyone^write' }
            ]
          },
          id: 'test-obs-1'
        };
        const transactionBundle: Bundle = {
          resourceType: 'Bundle',
          type: 'transaction',
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

        const req = nock(fhirServerBase)
          .get('/Practitioner')
          .query({ identifier: 'https://auth0.com|test.user' })
          .reply(200, userPractitionerResponse)
          .get('/Group')
          .query({ member: 'test-user-id', '_summary': 'true' })
          .reply(200, userGroupResponse)
          .get('/Observation/test-obs-1')
          .reply(200, persistedObs)
          .put('/Observation/test-obs-1', (obs) => {
            expect(obs).toBeTruthy();
            expect(obs.resourceType).toBe('Observation');
            expect(obs.id).toBe('test-obs-1');
            return true;
          })
          .reply(200);

        await controller.proxy('/', { }, 'POST', fhirServerBase, response, testUser, transactionBundle);

        req.done();
      });

      it('should call $meta-delete for removed permission and replace with user permission', async () => {
        const persistedObs = {
          resourceType: 'Observation',
          meta: {
            security: [
              { code: 'everyone^read' },
              { code: 'everyone^write' }
            ]
          },
          id: 'test-obs-1'
        };
        const transactionBundle: Bundle = {
          resourceType: 'Bundle',
          type: 'transaction',
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
          .persist()
          .get('/Practitioner')
          .query({ identifier: 'https://auth0.com|test.user' })
          .reply(200, userPractitionerResponse)
          .get('/Group')
          .query({ member: 'test-user-id', '_summary': 'true' })
          .reply(200, userGroupResponse)
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
            expect(obs.meta).toBeTruthy();
            expect(obs.meta.security).toBeTruthy();
            expect(obs.meta.security.length).toBe(2);

            // The new resource being updated should make sure the current user has permissions
            expect(obs.meta.security[0].code).toBe('user^test-user-id^read');
            expect(obs.meta.security[1].code).toBe('user^test-user-id^write');
            return true;
          })
          .reply(200);

        await controller.proxy('/', { }, 'POST', fhirServerBase, response, testUser, transactionBundle);

        req.done();
      });

      it('should make sure searches have _security query param', async () => {
        const req = nock(fhirServerBase)
          .get('/Practitioner')
          .query({ identifier: 'https://auth0.com|test.user' })
          .reply(200, userPractitionerResponse)
          .get('/Group')
          .query({ member: 'test-user-id', '_summary': 'true' })
          .reply(200, userGroupResponse)
          .get('/ImplementationGuide')
          // The purpose of this test is here... to make sure that the _security
          // query parameter is added to the request to the FHIR server's search
          .query({
            _security: 'everyone^read,user^test-user-id^read'
          })
          .reply(200, { resourceType: 'Bundle' });

        await controller.proxy('/ImplementationGuide', {}, 'GET', fhirServerBase, <Response> <any> response, testUser);

        req.done();

        expect(contentTypeSet).toBe(true);
        expect(isSent).toBe(true);
        expect(statusSet).toBe(true);
      });
    });
  });
});
