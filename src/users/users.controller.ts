import { Body, Controller, Delete, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { AuthUser } from '../common/decorators/user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SingnupUserResponseDto } from '../auth/dto/singnup-user-response.dto';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('me')
  async findOwn(@AuthUser() user: User) {
    return this.usersService.findOne({
      where: { id: user.id },
      select: {
        id: true,
        username: true,
        about: true,
        avatar: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /*  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.usersService.findOne(id);
  }*/
  @ApiOkResponse({
    type: SingnupUserResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  update(@AuthUser() user, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateOne(user, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.removeOne(+id);
  }
}
