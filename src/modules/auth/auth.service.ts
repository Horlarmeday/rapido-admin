import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { IJwtPayload } from './types/jwt-payload.types';
import { AdminDocument } from '../users/entities/user.entity';
import { Messages } from '../../core/messages/messages';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async validateUserByEmail(
    email: string,
    pass: string,
  ): Promise<IJwtPayload | null> {
    const user = await this.usersService.findOneByEmail(email);

    const isValidPassword = await this.comparePassword(pass, user?.password);
    if (user && isValidPassword) {
      return AuthService.formatJwtPayload(user);
    }
    return null;
  }

  async login(user: IJwtPayload) {
    const token = await this.generateToken(user);
    return { message: Messages.USER_AUTHENTICATED, result: token };
  }

  private async comparePassword(
    enteredPassword: string,
    dbPassword: string | undefined,
  ) {
    return await bcrypt.compare(enteredPassword, <string>dbPassword);
  }

  private async generateToken(
    payload: IJwtPayload | { sub: string; email: string },
  ) {
    return await this.jwtService.signAsync(payload);
  }

  private static formatJwtPayload(user: AdminDocument): IJwtPayload {
    const { first_name, email } = user;
    return {
      sub: user._id,
      email,
      first_name,
      role: user.role,
    };
  }
}
