import { Test, TestingModule } from '@nestjs/testing';
import { ConformanceController } from './conformance.controller';

describe('ConformanceController', () => {
  let controller: ConformanceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConformanceController],
    }).compile();

    controller = module.get<ConformanceController>(ConformanceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
