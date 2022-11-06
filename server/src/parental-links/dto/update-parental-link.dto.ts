import { PartialType } from '@nestjs/swagger';
import { CreateParentalLinkDto } from './create-parental-link.dto';

export class UpdateParentalLinkDto extends PartialType(CreateParentalLinkDto) {}
