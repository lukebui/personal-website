import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, Repository } from 'typeorm';
import { CreateCoupleDto } from './dto/create-couple.dto';
import { UpdateCoupleDto } from './dto/update-couple.dto';
import { Couple } from './entities/couple.entity';

const defaultRelations: FindOptionsRelations<Couple> = {
  partner1: true,
  partner2: true,
  children: true,
};
@Injectable()
export class CouplesService {
  constructor(
    @InjectRepository(Couple) private coupleRepository: Repository<Couple>,
  ) {}

  create(createCoupleDto: CreateCoupleDto) {
    return this.coupleRepository.save(
      this.coupleRepository.create(createCoupleDto),
    );
  }

  findAll() {
    return this.coupleRepository.find({ relations: defaultRelations });
  }

  findOne(id: number) {
    return this.coupleRepository.findOne({
      where: { id },
      relations: defaultRelations,
    });
  }

  update(id: number, updateCoupleDto: UpdateCoupleDto) {
    return this.coupleRepository.update(id, updateCoupleDto);
  }

  remove(id: number) {
    return this.coupleRepository.delete(id);
  }
}
