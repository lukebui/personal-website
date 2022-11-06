import { Test, TestingModule } from '@nestjs/testing';
import { ParentChildRelationshipsController } from './parent-child-relationships.controller';
import { ParentChildRelationshipsService } from './parent-child-relationships.service';

describe('ParentChildRelationshipsController', () => {
  let controller: ParentChildRelationshipsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParentChildRelationshipsController],
      providers: [ParentChildRelationshipsService],
    }).compile();

    controller = module.get<ParentChildRelationshipsController>(
      ParentChildRelationshipsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
