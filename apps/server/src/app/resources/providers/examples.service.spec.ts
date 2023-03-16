import { Test, TestingModule } from '@nestjs/testing';
import { ExamplesService } from './examples.service';

describe('ExamplesService', () => {
  let service: ExamplesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExamplesService],
    }).compile();

    service = module.get<ExamplesService>(ExamplesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
