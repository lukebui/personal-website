import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { JWTPayload } from './jwt-payload.interface';
import { UsersService } from 'src/users/users.service';
import * as _ from 'lodash';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private logger = new Logger(JwtStrategy.name);

  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_KEY,
    });
  }

  async validate(payload: JWTPayload) {
    const user = await this.usersService.findOneWithUid(payload.uid);

    return _.omit(user, 'password');
  }
}
