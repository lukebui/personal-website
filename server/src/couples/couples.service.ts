import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCoupleDto } from './dto/create-couple.dto';
import { UpdateCoupleDto } from './dto/update-couple.dto';
import { Couple } from './entities/couple.entity';

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
    return this.coupleRepository.find();
  }

  findOne(id: number) {
    return this.coupleRepository.findOneBy({ id });
  }

  update(id: number, updateCoupleDto: UpdateCoupleDto) {
    return this.coupleRepository.update(id, updateCoupleDto);
  }

  remove(id: number) {
    return this.coupleRepository.delete(id);
  }
}
