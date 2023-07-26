import { Test, TestingModule } from '@nestjs/testing';
import { FhirResourcesService } from './fhirResources.service';

describe('FhirResourceService', () => {
  let service: FhirResourcesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FhirResourcesService],
    }).compile();

    service = module.get<FhirResourcesService>(FhirResourcesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
