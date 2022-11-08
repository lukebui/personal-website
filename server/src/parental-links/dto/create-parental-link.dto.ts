import { Couple } from 'src/couples/entities/couple.entity';
import { Individual } from 'src/individuals/entities/individual.entity';
import { ParentType } from 'src/parent-types/entities/parent-type.entity';

export class CreateParentalLinkDto {
  type: ParentType;

  parentCouple: Couple;

  child: Individual;
}
