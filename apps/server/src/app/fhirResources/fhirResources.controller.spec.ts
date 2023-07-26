import { Test, TestingModule } from '@nestjs/testing';
import { FhirResourcesController } from './fhirResources.controller';

describe('ConformanceController', () => {
  let controller: FhirResourcesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FhirResourcesController],
    }).compile();

    controller = module.get<FhirResourcesController>(FhirResourcesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
