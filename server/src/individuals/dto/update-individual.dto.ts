import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Parent } from 'src/parents/entities/parent.entity';
import { CreateIndividualDto } from './create-individual.dto';

export class UpdateIndividualDto extends PartialType(CreateIndividualDto) {
  @ApiProperty()
  @Type(() => Parent)
  currentParents?: Parent[];

  @ApiProperty()
  @Type(() => Parent)
  removedParents?: Parent[];
}
