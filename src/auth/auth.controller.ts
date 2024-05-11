import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { User } from '../users/entities/user.entity';
import { AuthSigninDto } from './dto/auth-signin.dto';
import { AuthLoginDto } from './dto/auth-login.dto';

@ApiTags('Auth')
@Controller('')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {
  }


  @ApiOkResponse({
    description: 'Вход выполнен успешно',
    type: AuthLoginDto
  })
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async login(@Body() authSigninDto: AuthSigninDto): Promise<AuthLoginDto> {
    const { username, password } = authSigninDto;
    return await this.authService.validateLoginPassword(username, password);
  }

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.signup(createUserDto);
  }
}
