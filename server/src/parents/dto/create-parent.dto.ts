import { ApiProperty } from '@nestjs/swagger';
import { Individual } from 'src/individuals/entities/individual.entity';
import { ParentType } from 'src/parent-types/entities/parent-type.entity';

export class CreateParentDto {
  @ApiProperty()
  type: ParentType;

  @ApiProperty()
  parent: Individual;

  @ApiProperty()
  child: Individual;
}
