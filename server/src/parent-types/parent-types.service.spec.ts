import { Test, TestingModule } from '@nestjs/testing';
import { ParentTypesService } from './parent-types.service';

describe('ParentTypesService', () => {
  let service: ParentTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParentTypesService],
    }).compile();

    service = module.get<ParentTypesService>(ParentTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
