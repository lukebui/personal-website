import { PartialType } from '@nestjs/swagger';
import { CreateParentTypeDto } from './create-parent-type.dto';

export class UpdateParentTypeDto extends PartialType(CreateParentTypeDto) {}
