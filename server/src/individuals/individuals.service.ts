import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Parent } from 'src/parents/entities/parent.entity';
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
    @InjectRepository(Parent)
    private parentRepository: Repository<Parent>,
  ) {}

  create(createIndividualDto: CreateIndividualDto) {
    const newIndividual = this.individualRepository.create({
      firstName: createIndividualDto.firstName,
      middleName: createIndividualDto.middleName,
      lastName: createIndividualDto.lastName,
      alias: createIndividualDto.alias,
      note: createIndividualDto.note,
      gender: createIndividualDto.gender,
      dateOfBirth: createIndividualDto.dateOfBirth,
      dateOfDeath: createIndividualDto.dateOfDeath,
      hasDied: createIndividualDto.hasDied,
    });
    const newParents = createIndividualDto.newParents?.map((newParent) => {
      return this.parentRepository.create(newParent);
    });

    newIndividual.parents = newParents;

    return this.individualRepository.save(newIndividual);
  }

  findAll() {
    return this.individualRepository.find();
  }

  findAllWithParnents() {
    return this.individualRepository.find({ relations: { parents: true } });
  }

  findOne(id: number) {
    return this.individualRepository.findOneBy({ id });
  }

  async update(id: number, updateIndividualDto: UpdateIndividualDto) {
    const currentParents = updateIndividualDto.currentParents?.map(
      (currentParent) => {
        return this.parentRepository.create({
          id: currentParent.id,
          type: currentParent.type,
          parent: currentParent.parent,
        });
      },
    );

    const newParents = updateIndividualDto.newParents?.map((newParent) => {
      return this.parentRepository.create(newParent);
    });

    const parents = [...currentParents, ...newParents];

    const individual = this.individualRepository.create({
      id: id,
      firstName: updateIndividualDto.firstName,
      middleName: updateIndividualDto.middleName,
      lastName: updateIndividualDto.lastName,
      alias: updateIndividualDto.alias,
      note: updateIndividualDto.note,
      gender: updateIndividualDto.gender,
      dateOfBirth: updateIndividualDto.dateOfBirth,
      dateOfDeath: updateIndividualDto.dateOfDeath,
      hasDied: updateIndividualDto.hasDied,
      parents,
    });

    await Promise.all([
      this.individualRepository.save(individual),
      ...updateIndividualDto.removedParents.map((parent) =>
        this.parentRepository.delete(parent.id),
      ),
    ]);
  }

  remove(id: number) {
    return this.individualRepository.delete(id);
  }
}
