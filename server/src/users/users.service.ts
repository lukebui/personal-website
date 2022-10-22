import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  private hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  async create(createUserDto: CreateUserDto) {
    createUserDto.password = await this.hashPassword(createUserDto.password);

    return this.usersRepository.save(
      this.usersRepository.create({ ...createUserDto, isActive: true }),
    );
  }

  findAll() {
    return this.usersRepository.find();
  }

  findOneWithUid(uid: number) {
    return this.usersRepository.findOneBy({ uid });
  }

  findOneWithEmail(email: string) {
    return this.usersRepository.findOneBy({ email });
  }

  async update(uid: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await this.hashPassword(updateUserDto.password);
    }

    return this.usersRepository.update(uid, updateUserDto);
  }

  remove(uid: number) {
    return this.usersRepository.delete(uid);
  }
}
