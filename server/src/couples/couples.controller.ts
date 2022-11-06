import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiVersion } from 'src/enums/ApiVersion.enum';
import { CouplesService } from './couples.service';
import { CreateCoupleDto } from './dto/create-couple.dto';
import { UpdateCoupleDto } from './dto/update-couple.dto';

@ApiTags('Couples')
@Controller({ path: 'couples', version: ApiVersion.V_1 })
export class CouplesController {
  constructor(private readonly couplesService: CouplesService) {}

  @Post()
  create(@Body() createCoupleDto: CreateCoupleDto) {
    return this.couplesService.create(createCoupleDto);
  }

  @Get()
  findAll() {
    return this.couplesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.couplesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCoupleDto: UpdateCoupleDto) {
    return this.couplesService.update(+id, updateCoupleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.couplesService.remove(+id);
  }
}
