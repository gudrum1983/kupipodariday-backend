import { Injectable } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  findAll() {
    return `This action returns all wishes`;
  }

  findLast() {
    return this.wishesRepository.find({
      order: { createdAt: 'desc' },
      take: 40,
      relations: {
        owner: true,
        //offers: true,
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} wish`;
  }

  update(id: number, updateWishDto: UpdateWishDto) {
    return `This action updates a #${id} wish`;
  }

  remove(id: number) {
    return `This action removes a #${id} wish`;
  }
}
