import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import * as _ from 'lodash';
import { JwtService } from '@nestjs/jwt';
import { JWTPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    let user: User;
    try {
      user = await this.usersService.findOneWithEmail(email);
    } catch (error) {
      throw new HttpException(
        `Cannot find user with email ${email}`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (!user) return null;

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) return null;

    return _.omit(user, 'password');
  }

  async signIn(user: Omit<User, 'password'>) {
    const payload: JWTPayload = { email: user.email, uid: user.uid };

    return {
      user,
      accessToken: this.jwtService.sign(payload),
    };
  }
}
