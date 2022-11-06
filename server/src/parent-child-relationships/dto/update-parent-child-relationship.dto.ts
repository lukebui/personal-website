import { PartialType } from '@nestjs/swagger';
import { CreateParentChildRelationshipDto } from './create-parent-child-relationship.dto';

export class UpdateParentChildRelationshipDto extends PartialType(CreateParentChildRelationshipDto) {}
