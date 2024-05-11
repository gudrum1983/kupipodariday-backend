import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { User } from '../users/entities/user.entity';
import { SigninUserResponseDto, SigninUserDto } from './dto/signin-user.dto';
import { UserResponseDto } from '../users/dto/user-response.dto';

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
    type: SigninUserResponseDto
  })
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async login(@Body() authSigninDto: SigninUserDto): Promise<SigninUserResponseDto> {
    const { username, password } = authSigninDto;
    return await this.authService.validateLoginPassword(username, password);
  }

  @ApiOkResponse({
    description: 'Создание нового пользователя прошло успешно',
    type: UserResponseDto,
  })
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.signup(createUserDto);
  }
}
