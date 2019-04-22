import {Test, TestingModule} from '@nestjs/testing';
import {FhirController} from './fhir.controller';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [FhirController],
    }).compile();
  });

  /*
  describe('change-id', () => {
    it('should return "Welcome to server!"', async () => {
      const fhirController = app.get<FhirController>(FhirController);
    });
  });
   */
});
