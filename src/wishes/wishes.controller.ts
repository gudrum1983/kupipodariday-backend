import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { ApiExtraModels, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Wish } from './entities/wish.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthUser } from '../common/decorators/user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('Wishes')
@ApiExtraModels(Wish)
@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @ApiOkResponse({ type: null })
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @AuthUser() user: User,
    @Body() createWishDto: CreateWishDto,
  ): Promise<null> {
    console.log('CREATE WISH');
    console.log('CREATE WISH USER', user);
    return await this.wishesService.create(user, createWishDto);
  }

  @Get('last')
  findLast() {
    return this.wishesService.findLast();
  }

  @Get('top')
  findTop() {
    return this.wishesService.findTop();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wishesService.findOne(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWishDto: UpdateWishDto) {
    return this.wishesService.update(+id, updateWishDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wishesService.remove(+id);
  }
}
