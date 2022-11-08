import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateParentalTypeDto } from './dto/create-parent-type.dto';
import { UpdateParentalTypeDto } from './dto/update-parent-type.dto';
import { ParentalType } from './entities/parental-type.entity';

@Injectable()
export class ParentalTypesService {
  constructor(
    @InjectRepository(ParentalType)
    private parentalTypeRepository: Repository<ParentalType>,
  ) {}

  create(createParentTypeDto: CreateParentalTypeDto) {
    return this.parentalTypeRepository.save(
      this.parentalTypeRepository.create(createParentTypeDto),
    );
  }

  findAll() {
    return this.parentalTypeRepository.find();
  }

  findOne(id: number) {
    return this.parentalTypeRepository.findOneBy({ id });
  }

  update(id: number, updateParentTypeDto: UpdateParentalTypeDto) {
    return this.parentalTypeRepository.update(id, updateParentTypeDto);
  }

  async remove(id: number) {
    const parentType = await this.parentalTypeRepository.find({
      where: {
        id,
      },
      relations: { parentalLinks: true },
    });

    if (parentType.length) {
      if (parentType[0].parentalLinks.length)
        throw new HttpException(
          'Cannot delete. There are parent data depending on this type.',
          HttpStatus.FORBIDDEN,
        );

      return this.parentalTypeRepository.delete(id);
    } else {
      throw new HttpException(
        'Cannot find the requested data',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
