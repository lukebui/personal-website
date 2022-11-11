import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, Not, Repository } from 'typeorm';
import { CreateCoupleDto } from './dto/create-couple.dto';
import { UpdateCoupleDto } from './dto/update-couple.dto';
import { Couple } from './entities/couple.entity';

const defaultRelations: FindOptionsRelations<Couple> = {
  partner1: true,
  partner2: true,
};
@Injectable()
export class CouplesService {
  private logger = new Logger(CouplesService.name);

  constructor(
    @InjectRepository(Couple) private coupleRepository: Repository<Couple>,
  ) {}

  getPartnerIds(couple: Couple) {
    return [couple.partner1.id, couple.partner2.id].sort().join('-');
  }

  async create(createCoupleDto: CreateCoupleDto) {
    const newCouple = this.coupleRepository.create(createCoupleDto);

    const existCoupleWithSameIds = await this.coupleRepository.find({
      where: { partnerIds: this.getPartnerIds(newCouple) },
    });

    if (existCoupleWithSameIds.length) {
      throw new HttpException('This couple has existed.', HttpStatus.CONFLICT);
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

  async update(id: number, updateCoupleDto: UpdateCoupleDto) {
    const target = await this.coupleRepository.findOne({ where: { id } });

    const updated = this.coupleRepository.merge(target, updateCoupleDto);

    const check = await this.coupleRepository.find({
      where: {
        id: Not(id),
        partnerIds: this.getPartnerIds(updated),
      },
    });

    if (check.length) {
      throw new HttpException('This couple has existed.', HttpStatus.CONFLICT);
    }

    return this.coupleRepository.update(id, updateCoupleDto);
  }

  remove(id: number) {
    return this.coupleRepository.softDelete(id);
  }
}
