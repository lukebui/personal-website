import { PartialType } from '@nestjs/swagger';
import { CreateParentalTypeDto } from './create-parent-type.dto';

export class UpdateParentalTypeDto extends PartialType(CreateParentalTypeDto) {}
