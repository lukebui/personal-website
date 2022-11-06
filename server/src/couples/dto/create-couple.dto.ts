import { ApiProperty } from '@nestjs/swagger';
import { Individual } from 'src/individuals/entities/individual.entity';

export class CreateCoupleDto {
  @ApiProperty()
  partner1: Individual;

  @ApiProperty()
  partner2: Individual;

  @ApiProperty()
  stillMarried: boolean;
}
