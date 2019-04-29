import {Test, TestingModule} from '@nestjs/testing';
import {FhirController} from './fhir.controller';
import {HttpModule} from '@nestjs/common';
import nock = require('nock');
import http = require('axios/lib/adapters/http');

jest.mock('config', () => {
  return {
    get: (config: string) => {
      return {};
    }
  };
});

describe('FhirController', () => {
  let app: TestingModule;
  let controller: FhirController;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [FhirController],
      imports: [HttpModule.register({
        adapter: http
      })]
    }).compile();
    controller = app.get<FhirController>(FhirController);
  });

  describe('change-id', () => {
    it('should change the id of a resource', async () => {
      const fhirServer = 'http://test-fhir-server.com';
      const getRequest = nock(fhirServer)
        .get('/StructureDefinition/test')
        .reply(200, { id: 'test' });
      const putRequest = nock(fhirServer)
        .put('/StructureDefinition/new-test-id')
        .reply(200);
      const deleteRequest = nock(fhirServer)
        .delete('/StructureDefinition/test')
        .reply(200);

      const results = await controller.changeId(fhirServer, 'StructureDefinition', 'test', 'new-test-id');

      expect(results).toBeTruthy();
      getRequest.done();
      putRequest.done();
      deleteRequest.done();
    });
  });
});
