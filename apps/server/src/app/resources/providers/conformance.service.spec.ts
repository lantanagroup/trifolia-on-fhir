import { Test, TestingModule } from '@nestjs/testing';
import { ConformanceService } from './conformance.service';

describe('ConformanceService', () => {
  let service: ConformanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConformanceService],
    }).compile();

    service = module.get<ConformanceService>(ConformanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
