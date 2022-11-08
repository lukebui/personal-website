import { Test, TestingModule } from '@nestjs/testing';
import { ParentalTypesService } from './parental-types.service';

describe('ParentalTypesService', () => {
  let service: ParentalTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParentalTypesService],
    }).compile();

    service = module.get<ParentalTypesService>(ParentalTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
