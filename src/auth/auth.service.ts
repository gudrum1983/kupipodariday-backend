import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { verifyHashSync } from '../helpers/hash';


@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    readonly usersService: UsersService,
  ) {}

  async login(user: User) {
    const payload = { username: user.username, sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }

  async validateLoginPassword(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);
    if (user && verifyHashSync(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    if (!user) {
      throw new UnauthorizedException();
    }
    return null;
  }
}
