import { Test, TestingModule } from '@nestjs/testing';
import { ParentalLinksService } from './parental-links.service';

describe('ParentalLinksService', () => {
  let service: ParentalLinksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParentalLinksService],
    }).compile();

    service = module.get<ParentalLinksService>(ParentalLinksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
