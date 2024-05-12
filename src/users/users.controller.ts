import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { AuthUser } from '../common/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserProfileResponseDto } from './dto/user-profile-response.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUsersDto } from './dto/find-user.dto';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOkResponse({ type: UserProfileResponseDto })
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  updateMe(
    @AuthUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserProfileResponseDto> {
    console.log('PATCH USER');
    return this.usersService.updateOne(user, updateUserDto);
  }

  @ApiOkResponse({ type: UserProfileResponseDto })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  findOwn(@AuthUser() user: User): UserProfileResponseDto {
    console.log('GET USER');
    return this.usersService.instanceUserToPlain(user);
  }

  @ApiOkResponse({ type: UserProfileResponseDto, isArray: true })
  @Post('find')
  findMany(@Body() body: FindUsersDto): Promise<Array<UserProfileResponseDto>> {
    return this.usersService.findMany(body);
  }

  @ApiOkResponse({ type: UserProfileResponseDto })
  @Get(':username')
  findOne(
    @Param('username') username: string,
  ): Promise<UserProfileResponseDto> {
    return this.usersService.findByUsername(username);
  }
}
