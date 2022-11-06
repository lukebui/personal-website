import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, Repository } from 'typeorm';
import { CreateCoupleDto } from './dto/create-couple.dto';
import { UpdateCoupleDto } from './dto/update-couple.dto';
import { Couple } from './entities/couple.entity';

const defaultRelations: FindOptionsRelations<Couple> = {
  partner1: true,
  partner2: true,
};
@Injectable()
export class CouplesService {
  constructor(
    @InjectRepository(Couple) private coupleRepository: Repository<Couple>,
  ) {}

  async create(createCoupleDto: CreateCoupleDto) {
    const newCouple = this.coupleRepository.create(createCoupleDto);

    const existCoupleWithSameIds = await this.coupleRepository.find({
      where: { partnerIds: newCouple.partnerIds },
    });

    if (existCoupleWithSameIds.length) {
      throw new HttpException(
        'This couple has existed.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.coupleRepository.save(newCouple);
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
