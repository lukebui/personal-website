import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateParentDto } from './dto/create-parent.dto';
import { UpdateParentDto } from './dto/update-parent.dto';
import { Parent } from './entities/parent.entity';

@Injectable()
export class ParentsService {
  constructor(
    @InjectRepository(Parent)
    private parentRepository: Repository<Parent>,
  ) {}

  create(createParentDto: CreateParentDto) {
    return this.parentRepository.save(
      this.parentRepository.create(createParentDto),
    );
  }

  findAll() {
    return this.parentRepository.find();
  }

  findOne(id: number) {
    return this.parentRepository.findOneBy({ id });
  }

  update(id: number, updateParentDto: UpdateParentDto) {
    return this.parentRepository.update(id, updateParentDto);
  }

  remove(id: number) {
    return this.parentRepository.delete(id);
  }
}
