import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ParentalTypesService } from './parental-types.service';
import { CreateParentalTypeDto } from './dto/create-parent-type.dto';
import { UpdateParentalTypeDto } from './dto/update-parent-type.dto';
import { ApiVersion } from 'src/enums/ApiVersion.enum';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Parent types')
@Controller({ path: 'parent-types', version: ApiVersion.V_1 })
export class ParentalTypesController {
  constructor(private readonly parentTypesService: ParentalTypesService) {}

  @Post()
  create(@Body() createParentTypeDto: CreateParentalTypeDto) {
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
    @Body() updateParentTypeDto: UpdateParentalTypeDto,
  ) {
    return this.parentTypesService.update(+id, updateParentTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.parentTypesService.remove(+id);
  }
}
