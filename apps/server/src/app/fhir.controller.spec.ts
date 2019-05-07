import {Test, TestingModule} from '@nestjs/testing';
import {FhirController} from './fhir.controller';
import {HttpModule} from '@nestjs/common';
import {ConfigService} from './config.service';
import {ITofUser} from './models/tof-request';
import nock = require('nock');
import http = require('axios/lib/adapters/http');
import {createTestUser, createUserGroupResponse, createUserPractitionerResponse} from './test.helper';
import {addPermission} from '../../../../libs/tof-lib/src/lib/helper';
import {StructureDefinition} from '../../../../libs/tof-lib/src/lib/stu3/fhir';

nock.disableNetConnect();

describe('FhirController', () => {
  let app: TestingModule;
  let controller: FhirController;
  const userPractitionerResponse = createUserPractitionerResponse();
  const userGroupResponse = createUserGroupResponse();
  const testUser = createTestUser();
  const configService = new ConfigService();

  beforeAll(async () => {
    configService.server.enableSecurity = true;
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
    it('should change the id of a resource', async () => {
      const fhirServer = 'http://test-fhir-server.com';
      const persistedResource = new StructureDefinition({
        resourceType: 'StructureDefinition',
        id: 'test',
        meta: {}
      });

      addPermission(persistedResource.meta, 'everyone', 'write');

      const req = nock(fhirServer)
        .get('/StructureDefinition/test')
        .reply(200, persistedResource)
        .get('/Practitioner')
        .query({ identifier: 'https://auth0.com|test.user' })
        .reply(200, userPractitionerResponse)
        .get('/Group')
        .query({ member: 'test-user-id', '_summary': 'true' })
        .reply(200, userGroupResponse)
        .put('/StructureDefinition/new-test-id')
        .reply(200)
        .delete('/StructureDefinition/test')
        .reply(200);

      const results = await controller.changeId(fhirServer, 'StructureDefinition', 'test', 'new-test-id', testUser);

      req.done();

      expect(results).toBeTruthy();
    });
  });
});
