import { Injectable } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
  ) {}

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

  async findMany(query: FindManyOptions<Wish>) {
    return await this.wishesRepository.find(query);
  }

  findLast() {
    const query: FindManyOptions = {
      order: { createdAt: 'desc' },
      take: 40,
      relations: ['owner', 'offers', 'offers.user'],
    };
    return this.findMany(query);
  }

  findTop() {
    const query: FindManyOptions = {
      order: { copied: 'desc' },
      take: 20,
      relations: ['owner', 'offers', 'offers.user'],
    };
    return this.findMany(query);
  }

  /*  async findLast() {
      return this.wishesRepository
        .createQueryBuilder('wish')
        .leftJoinAndSelect('wish.owner', 'owner')
        .leftJoinAndSelect('wish.offers', 'offers') // Подключаем связанные сущности offers
        .orderBy('wish.createdAt', 'DESC')
        .take(40)
        .getMany();
    }*/

  findOne(id: number) {
    return this.wishesRepository.findOne({
      where: { id },
      relations: {
        owner: true,
        offers: true,
      },
    });
  }

  update(id: number, updateWishDto: UpdateWishDto) {
    return `This action updates a #${id} wish`;
  }

  remove(id: number) {
    return `This action removes a #${id} wish`;
  }
}
