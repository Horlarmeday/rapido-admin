import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IJwtPayload } from '../types/jwt-payload.types';
import { UsersService } from '../../users/users.service';
import { Messages } from '../../../core/messages/messages';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWTKEY,
    });
  }

  async validate(payload: IJwtPayload) {
    // check if user in the token actually exist
    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException(Messages.UNAUTHORIZED);
    }
    return payload;
  }
}
