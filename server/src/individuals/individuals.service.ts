import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, Repository } from 'typeorm';
import { CreateIndividualDto } from './dto/create-individual.dto';
import { UpdateIndividualDto } from './dto/update-individual.dto';
import { Individual } from './entities/individual.entity';

const defaultRelations: FindOptionsRelations<Individual> = {
  parents: true,
  spouses: true,
};

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
    return this.individualRepository.find({ relations: defaultRelations });
  }

  findOne(id: number) {
    return this.individualRepository.findOne({
      where: { id },
      relations: defaultRelations,
    });
  }

  async update(id: number, updateIndividualDto: UpdateIndividualDto) {
    return this.individualRepository.update(id, updateIndividualDto);
  }

  remove(id: number) {
    return this.individualRepository.delete(id);
  }
}
