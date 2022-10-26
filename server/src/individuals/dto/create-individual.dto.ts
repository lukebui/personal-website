import { ApiProperty } from '@nestjs/swagger';
import { IndividualGender } from 'src/enums/IndividualGender.enum';
import { Type } from 'class-transformer';

export class CreateIndividualDto {
  @ApiProperty()
  firstName: string | null;

  @ApiProperty()
  middleName: string | null;

  @ApiProperty()
  lastName: string | null;

  @ApiProperty()
  alias: string | null;

  @ApiProperty()
  note: string | null;

  @ApiProperty({
    enum: IndividualGender,
  })
  gender: IndividualGender;

  @Type(() => Date)
  @ApiProperty()
  dateOfBirth: Date | null;

  @Type(() => Date)
  @ApiProperty()
  dateOfDeath: Date | null;

  @ApiProperty()
  hasDied: boolean | null;
}
