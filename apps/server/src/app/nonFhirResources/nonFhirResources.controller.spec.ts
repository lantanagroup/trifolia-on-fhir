import { Test, TestingModule } from '@nestjs/testing';
import { NonFhirResourcesController } from './nonFhirResources.controller';

describe('ExamplesController', () => {
  let controller: NonFhirResourcesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NonFhirResourcesController],
    }).compile();

    controller = module.get<NonFhirResourcesController>(NonFhirResourcesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
