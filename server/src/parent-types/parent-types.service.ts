import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateParentTypeDto } from './dto/create-parent-type.dto';
import { UpdateParentTypeDto } from './dto/update-parent-type.dto';
import { ParentType } from './entities/parent-type.entity';

@Injectable()
export class ParentTypesService {
  constructor(
    @InjectRepository(ParentType)
    private parentTypeRepository: Repository<ParentType>,
  ) {}

  create(createParentTypeDto: CreateParentTypeDto) {
    return this.parentTypeRepository.save(
      this.parentTypeRepository.create(createParentTypeDto),
    );
  }

  findAll() {
    return this.parentTypeRepository.find();
  }

  findOne(id: number) {
    return this.parentTypeRepository.findOneBy({ id });
  }

  update(id: number, updateParentTypeDto: UpdateParentTypeDto) {
    return this.parentTypeRepository.update(id, updateParentTypeDto);
  }

  async remove(id: number) {
    const parentType = await this.parentTypeRepository.find({
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

      return this.parentTypeRepository.delete(id);
    } else {
      throw new HttpException(
        'Cannot find the requested data',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
