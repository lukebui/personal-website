import { Test, TestingModule } from '@nestjs/testing';
import { ParentalLinksController } from './parental-links.controller';
import { ParentalLinksService } from './parental-links.service';

describe('ParentalLinksController', () => {
  let controller: ParentalLinksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParentalLinksController],
      providers: [ParentalLinksService],
    }).compile();

    controller = module.get<ParentalLinksController>(ParentalLinksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
