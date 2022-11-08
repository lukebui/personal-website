import { Couple } from 'src/couples/entities/couple.entity';
import { Individual } from 'src/individuals/entities/individual.entity';
import { ParentalType } from 'src/parental-types/entities/parental-type.entity';

export class CreateParentalLinkDto {
  type: ParentalType;

  parentCouple: Couple;

  child: Individual;
}
