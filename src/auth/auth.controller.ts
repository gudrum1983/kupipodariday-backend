import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthUser } from '../common/decorators/user.decorator';
import { User } from '../users/entities/user.entity';
import { AuthSigninDto } from './dto/auth-signin.dto';

@ApiTags('Auth')
@Controller('')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {
  }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  login(
    @Body() authSigninDto: AuthSigninDto,
  ) {
    console.log({authSigninDto});
    return this.authService.validateLoginPassword(authSigninDto.username, authSigninDto.password);

    //if (this.authService.validateLoginPassword(authSigninDto.username, authSigninDto.password)) {}


  }

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.signup(createUserDto);
  }
}
