import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ParentTypesService } from './parent-types.service';
import { CreateParentTypeDto } from './dto/create-parent-type.dto';
import { UpdateParentTypeDto } from './dto/update-parent-type.dto';
import { ApiVersion } from 'src/enums/ApiVersion.enum';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Parent types')
@Controller({ path: 'parent-types', version: ApiVersion.V_1 })
export class ParentTypesController {
  constructor(private readonly parentTypesService: ParentTypesService) {}

  @Post()
  create(@Body() createParentTypeDto: CreateParentTypeDto) {
    return this.parentTypesService.create(createParentTypeDto);
  }

  @Get()
  findAll() {
    return this.parentTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.parentTypesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateParentTypeDto: UpdateParentTypeDto,
  ) {
    return this.parentTypesService.update(+id, updateParentTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.parentTypesService.remove(+id);
  }
}
