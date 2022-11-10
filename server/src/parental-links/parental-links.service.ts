import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsRelations, Not, Repository } from 'typeorm';
import { CreateParentalLinkDto } from './dto/create-parental-link.dto';
import { UpdateParentalLinkDto } from './dto/update-parental-link.dto';
import { ParentalLink } from './entities/parental-link.entity';

const defaultRelations: FindOptionsRelations<ParentalLink> = {
  type: true,
  parentCouple: true,
  child: true,
  olderSibling: true,
};

@Injectable()
export class ParentalLinksService {
  constructor(
    @InjectRepository(ParentalLink)
    private parentalLinkRepository: Repository<ParentalLink>,
  ) {}

  async create(createParentalLinkDto: CreateParentalLinkDto) {
    const newParentalLink = this.parentalLinkRepository.create(
      createParentalLinkDto,
    );

    const check = await this.parentalLinkRepository.find({
      where: {
        child: newParentalLink.child,
        parentCouple: newParentalLink.parentCouple,
      },
    });

    if (check.length) {
      throw new HttpException(
        'The child has been linked to the parents.',
        HttpStatus.CONFLICT,
      );
    }

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

  async update(id: number, updateParentalLinkDto: UpdateParentalLinkDto) {
    const target = await this.parentalLinkRepository.findOneBy({ id });

    const updated = this.parentalLinkRepository.merge(
      target,
      updateParentalLinkDto,
    );

    const check = await this.parentalLinkRepository.find({
      where: {
        id: Not(id),
        child: updated.child,
        parentCouple: updated.parentCouple,
      },
    });

    if (check.length) {
      throw new HttpException(
        'The child has been linked to the parents.',
        HttpStatus.CONFLICT,
      );
    }

    return this.parentalLinkRepository.update(id, updateParentalLinkDto);
  }

  remove(id: number) {
    return this.parentalLinkRepository.delete(id);
  }
}
