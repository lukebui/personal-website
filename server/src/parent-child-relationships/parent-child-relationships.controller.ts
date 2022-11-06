import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ParentChildRelationshipsService } from './parent-child-relationships.service';
import { CreateParentChildRelationshipDto } from './dto/create-parent-child-relationship.dto';
import { UpdateParentChildRelationshipDto } from './dto/update-parent-child-relationship.dto';
import { ApiVersion } from 'src/enums/ApiVersion.enum';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Parent child relationships')
@Controller({ path: 'parent-child-relationships', version: ApiVersion.V_1 })
export class ParentChildRelationshipsController {
  constructor(
    private readonly parentChildRelationshipsService: ParentChildRelationshipsService,
  ) {}

  @Post()
  create(
    @Body() createParentChildRelationshipDto: CreateParentChildRelationshipDto,
  ) {
    return this.parentChildRelationshipsService.create(
      createParentChildRelationshipDto,
    );
  }

  @Get()
  findAll() {
    return this.parentChildRelationshipsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.parentChildRelationshipsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateParentChildRelationshipDto: UpdateParentChildRelationshipDto,
  ) {
    return this.parentChildRelationshipsService.update(
      +id,
      updateParentChildRelationshipDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.parentChildRelationshipsService.remove(+id);
  }
}
