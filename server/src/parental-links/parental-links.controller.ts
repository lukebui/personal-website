import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ParentalLinksService } from './parental-links.service';
import { CreateParentalLinkDto } from './dto/create-parental-link.dto';
import { UpdateParentalLinkDto } from './dto/update-parental-link.dto';
import { ApiVersion } from 'src/enums/ApiVersion.enum';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Parental links')
@Controller({ path: 'parental-links', version: ApiVersion.V_1 })
export class ParentalLinksController {
  constructor(private readonly parentalLinksService: ParentalLinksService) {}

  @Post()
  create(@Body() createParentalLinkDto: CreateParentalLinkDto) {
    return this.parentalLinksService.create(createParentalLinkDto);
  }

  @Get()
  findAll() {
    return this.parentalLinksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.parentalLinksService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateParentalLinkDto: UpdateParentalLinkDto,
  ) {
    return this.parentalLinksService.update(+id, updateParentalLinkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.parentalLinksService.remove(+id);
  }
}
