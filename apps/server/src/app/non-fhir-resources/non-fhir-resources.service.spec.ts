import { Test, TestingModule } from '@nestjs/testing';
import { NonFhirResourcesService } from './non-fhir-resources.service';

describe('NonFhirResourcesService', () => {
  let service: NonFhirResourcesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NonFhirResourcesService],
    }).compile();

    service = module.get<NonFhirResourcesService>(NonFhirResourcesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
