import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateIndividualDto } from './dto/create-individual.dto';
import { UpdateIndividualDto } from './dto/update-individual.dto';
import { Individual } from './entities/individual.entity';

@Injectable()
export class IndividualsService {
  private readonly logger = new Logger(IndividualsService.name);

  constructor(
    @InjectRepository(Individual)
    private individualRepository: Repository<Individual>,
  ) {}

  create(createIndividualDto: CreateIndividualDto) {
    return this.individualRepository.save(
      this.individualRepository.create(createIndividualDto),
    );
  }

  findAll() {
    return this.individualRepository.find();
  }

  findOne(id: number) {
    return this.individualRepository.findOne({
      where: { id },
    });
  }

  async update(id: number, updateIndividualDto: UpdateIndividualDto) {
    return this.individualRepository.update(id, updateIndividualDto);
  }

  remove(id: number) {
    return this.individualRepository.delete(id);
  }
}
