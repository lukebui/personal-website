import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateParentChildRelationshipDto } from './dto/create-parent-child-relationship.dto';
import { UpdateParentChildRelationshipDto } from './dto/update-parent-child-relationship.dto';
import { ParentChildRelationship } from './entities/parent-child-relationship.entity';

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
    return this.parentChildRelationshipRepository.find();
  }

  findOne(id: number) {
    return this.parentChildRelationshipRepository.findOneBy({ id });
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
