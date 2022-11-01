import { Test, TestingModule } from '@nestjs/testing';
import { ParentTypesController } from './parent-types.controller';
import { ParentTypesService } from './parent-types.service';

describe('ParentTypesController', () => {
  let controller: ParentTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParentTypesController],
      providers: [ParentTypesService],
    }).compile();

    controller = module.get<ParentTypesController>(ParentTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
