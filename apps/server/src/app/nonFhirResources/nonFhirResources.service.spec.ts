import { Test, TestingModule } from '@nestjs/testing';
import { NonFhirResourcesService } from './nonFhirResources.service';

describe('NonFhirResourceService', () => {
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
