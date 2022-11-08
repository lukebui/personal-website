import { Test, TestingModule } from '@nestjs/testing';
import { ParentalTypesController } from './parental-types.controller';
import { ParentalTypesService } from './parental-types.service';

describe('ParentTypesController', () => {
  let controller: ParentalTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParentalTypesController],
      providers: [ParentalTypesService],
    }).compile();

    controller = module.get<ParentalTypesController>(ParentalTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
