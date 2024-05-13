import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
  ) {}

  private async findMany(query: FindManyOptions<Wish>) {
    const options: FindManyOptions<Wish> = {
      ...query,
      relations: ['owner', 'offers', 'offers.user'],
    };

    return await this.wishesRepository.find(options);
  }

  private async findOne(query: FindOneOptions<Wish>): Promise<Wish> {
    const options: FindOneOptions<Wish> = {
      ...query,
      relations: ['owner', 'offers', 'offers.user'],
    };
    const item = await this.wishesRepository.findOne(options);
    if (!item) {
      throw new NotFoundException('Такой подарок не найден!');
    }
    return item;
  }

  async create(user, createWishDto: CreateWishDto) {
    const createWish = this.wishesRepository.create({
      ...createWishDto,
      owner: user.id,
    });
    const newWish = await this.wishesRepository.save(createWish);
    if (!newWish) {
      throw new Error('Failed to create a new wish');
    }
    return null;
  }

  findLast() {
    const query: FindManyOptions<Wish> = {
      order: { createdAt: 'desc' },
      take: 40,
    };
    return this.findMany(query);
  }

  findTop() {
    const query: FindManyOptions = {
      order: { copied: 'desc' },
      take: 20,
    };
    return this.findMany(query);
  }

  findOneById(id: number) {
    const query: FindOneOptions<Wish> = { where: { id } };
    return this.findOne(query);
  }

  async update(wishId: number, userId, updateWishDto: UpdateWishDto) {
    const wish = await this.findOneById(wishId);

    if (wish.owner.id !== userId) {
      throw new ForbiddenException(
        'Вы не имеете права редактировать этот подарок.',
      );
    }

    if (wish.offers.length > 0) {
      throw new BadRequestException('Подарок закрыт для редактирования.');
    }
    const item = await this.wishesRepository.update(wishId, updateWishDto);
    if (item.affected !== 1) {
      throw new InternalServerErrorException(
        ' Непредвиденная ошибка, обратитесь к администратору',
      );
    }
    return null;
  }

  remove(id: number) {
    return `This action removes a #${id} wish`;
  }
}
