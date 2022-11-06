import { ApiProperty } from '@nestjs/swagger';
import { Couple } from 'src/couples/entities/couple.entity';
import { Individual } from 'src/individuals/entities/individual.entity';
import { ParentType } from 'src/parent-types/entities/parent-type.entity';

export class CreateParentalLinkDto {
  @ApiProperty()
  type: ParentType;

  @ApiProperty()
  parentCouple: Couple;

  @ApiProperty()
  child: Individual;
}
