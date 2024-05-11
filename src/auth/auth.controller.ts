import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthUser } from '../common/decorators/user.decorator';

@ApiTags('Auth')
@Controller('')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  login(@AuthUser() user,
        @Body() createUserDto: CreateUserDto,
        ) {
    /* Генерируем для пользователя JWT-токен */
    return this.authService.login(user);
  }

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    /* При регистрации создаем пользователя */
    const user = await this.usersService.signup(createUserDto);
    return user;
  }
}
