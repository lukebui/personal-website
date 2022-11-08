import { IndividualGender } from 'src/enums/IndividualGender.enum';
import { Type } from 'class-transformer';

export class CreateIndividualDto {
  firstName: string | null;

  middleName: string | null;

  lastName: string | null;

  alias: string | null;

  note: string | null;

  gender: IndividualGender;

  @Type(() => Date)
  dateOfBirth: Date | null;

  @Type(() => Date)
  dateOfDeath: Date | null;

  hasDied: boolean | null;
}
