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

type RequestDelete = {
  userId: number;
  wishId: number;
};

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

  private async findOneForCopy(id: number): Promise<Wish> {
    const options: FindOneOptions<Wish> = {
      where: { id },
      select: ['name', 'link', 'image', 'price', 'description', 'copied'],
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
    return await this.wishesRepository.save(createWish);
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

  async deleteOne({ wishId, userId }: RequestDelete): Promise<null> {
    const wish = await this.findOneById(wishId);

    if (wish.owner.id !== userId) {
      throw new BadRequestException('Вы не имеете права удалить этот подарок.');
    }

    await this.wishesRepository.remove(wish);
    return null;
  }

  async copyOne({ wishId, user }) {
    const { copied, ...data } = await this.findOneForCopy(wishId);
    await this.wishesRepository.update(wishId, { copied: copied + 1 });
    return await this.create(user, data);
  }
}
