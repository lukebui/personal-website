import { Test, TestingModule } from '@nestjs/testing';
import { ParentChildRelationshipsService } from './parent-child-relationships.service';

describe('ParentChildRelationshipsService', () => {
  let service: ParentChildRelationshipsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParentChildRelationshipsService],
    }).compile();

    service = module.get<ParentChildRelationshipsService>(ParentChildRelationshipsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
