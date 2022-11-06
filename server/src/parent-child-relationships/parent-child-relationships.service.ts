import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, Repository } from 'typeorm';
import { CreateParentChildRelationshipDto } from './dto/create-parent-child-relationship.dto';
import { UpdateParentChildRelationshipDto } from './dto/update-parent-child-relationship.dto';
import { ParentChildRelationship } from './entities/parent-child-relationship.entity';

const defaultRelations: FindOptionsRelations<ParentChildRelationship> = {
  type: true,
  parentCouple: true,
  child: true,
};
@Injectable()
export class ParentChildRelationshipsService {
  constructor(
    @InjectRepository(ParentChildRelationship)
    private parentChildRelationshipRepository: Repository<ParentChildRelationship>,
  ) {}

  create(createParentChildRelationshipDto: CreateParentChildRelationshipDto) {
    return this.parentChildRelationshipRepository.save(
      this.parentChildRelationshipRepository.create(
        createParentChildRelationshipDto,
      ),
    );
  }

  findAll() {
    return this.parentChildRelationshipRepository.find({
      relations: defaultRelations,
    });
  }

  findOne(id: number) {
    return this.parentChildRelationshipRepository.findOne({
      where: { id },
      relations: defaultRelations,
    });
  }

  update(
    id: number,
    updateParentChildRelationshipDto: UpdateParentChildRelationshipDto,
  ) {
    return this.parentChildRelationshipRepository.update(
      id,
      updateParentChildRelationshipDto,
    );
  }

  remove(id: number) {
    return this.parentChildRelationshipRepository.delete(id);
  }
}
