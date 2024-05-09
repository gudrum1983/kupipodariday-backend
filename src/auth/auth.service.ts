import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { HashService } from '../hash/hash.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private readonly hashService: HashService,
  ) {}

  auth(user: User) {
    const payload = { sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }

  async validateLoginPassword(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);
    if (user && this.hashService.comparePasswords(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    if (!user) {
      throw new UnauthorizedException();
    }
    return null;
  }
}
