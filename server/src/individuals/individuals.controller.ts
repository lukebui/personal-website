import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
} from '@nestjs/common';
import { IndividualsService } from './individuals.service';
import { CreateIndividualDto } from './dto/create-individual.dto';
import { UpdateIndividualDto } from './dto/update-individual.dto';
import { ApiTags } from '@nestjs/swagger';
import { ApiVersion } from 'src/enums/ApiVersion.enum';

@ApiTags('Individuals')
@Controller({ path: 'individuals', version: ApiVersion.V_1 })
export class IndividualsController {
  private readonly logger = new Logger(IndividualsController.name);

  constructor(private readonly individualsService: IndividualsService) {}

  @Post()
  create(@Body() createIndividualDto: CreateIndividualDto) {
    return this.individualsService.create(createIndividualDto);
  }

  @Get()
  findAllWithParents() {
    return this.individualsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.individualsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateIndividualDto: UpdateIndividualDto,
  ) {
    return this.individualsService.update(+id, updateIndividualDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.individualsService.remove(+id);
  }
}
