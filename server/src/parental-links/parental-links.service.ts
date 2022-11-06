import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, Repository } from 'typeorm';
import { CreateParentalLinkDto } from './dto/create-parental-link.dto';
import { UpdateParentalLinkDto } from './dto/update-parental-link.dto';
import { ParentalLink } from './entities/parental-link.entity';

const defaultRelations: FindOptionsRelations<ParentalLink> = {
  type: true,
  parentCouple: true,
  child: true,
};

@Injectable()
export class ParentalLinksService {
  constructor(
    @InjectRepository(ParentalLink)
    private parentalLinkRepository: Repository<ParentalLink>,
  ) {}

  create(createParentalLinkDto: CreateParentalLinkDto) {
    return this.parentalLinkRepository.save(
      this.parentalLinkRepository.create(createParentalLinkDto),
    );
  }

  findAll() {
    return this.parentalLinkRepository.find({ relations: defaultRelations });
  }

  findOne(id: number) {
    return this.parentalLinkRepository.findOne({
      where: { id },
      relations: defaultRelations,
    });
  }

  update(id: number, updateParentalLinkDto: UpdateParentalLinkDto) {
    return this.parentalLinkRepository.update(id, updateParentalLinkDto);
  }

  remove(id: number) {
    return this.parentalLinkRepository.delete(id);
  }
}
