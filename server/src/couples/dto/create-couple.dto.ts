import { Individual } from 'src/individuals/entities/individual.entity';

export class CreateCoupleDto {
  partner1: Individual;

  partner2: Individual;

  stillMarried: boolean;
}
