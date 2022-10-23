import { ApiProperty } from '@nestjs/swagger';
import { IndividualGender } from 'src/enums/IndividualGender.enum';

export class CreateIndividualDto {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  middleName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  alias: string;

  @ApiProperty()
  note: string;

  @ApiProperty({
    enum: IndividualGender,
  })
  gender: IndividualGender;
}
