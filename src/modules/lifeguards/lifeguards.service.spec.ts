import { Test, TestingModule } from '@nestjs/testing';
import { LifeguardsService } from './lifeguards.service';

describe('LifeguardsService', () => {
  let service: LifeguardsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LifeguardsService],
    }).compile();

    service = module.get<LifeguardsService>(LifeguardsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
