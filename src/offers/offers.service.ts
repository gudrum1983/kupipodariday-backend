import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindManyOptions, Repository } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { User } from '../users/entities/user.entity';
import { WishesService } from '../wishes/wishes.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>,
    readonly wishService: WishesService,
    readonly userService: UsersService,
    private readonly dataSource: DataSource,
  ) {}

  async create(currentUser: User, createOfferDto: CreateOfferDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    console.log(createOfferDto);
    const { amount, hidden, itemId } = createOfferDto;
    const currentWish = await this.wishService.findOne(itemId);

    if (!currentWish) {
      throw new NotFoundException('Такой подарок не найден!');
    }

    if (currentWish.owner.id === currentUser.id) {
      throw new ForbiddenException(
        'Вы серьёзно? Нельзя спонсировать собственный подарок.',
      );
    }

    if (currentWish.raised === Number(currentWish.price)) {
      throw new BadRequestException(
        'Вы опоздали, на этот подарок уже нельзя скинуться!',
      );
    }

    const sumWithReised = currentWish.raised + amount;

    if (sumWithReised > Number(currentWish.price)) {
      throw new BadRequestException(
        'Сумма заявки превышает стоимость подарка!',
      );
    }
    currentWish.raised = sumWithReised;
    const createOffer = this.offersRepository.create({
      item: currentWish,
      user: currentUser,
      amount: amount,
      hidden: hidden,
    });

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Сохраняем пользователя
      const newOffer = await queryRunner.manager.save(createOffer);
      currentWish.offers.push(newOffer);
      // Сохраняем другую сущность
      await queryRunner.manager.save(currentWish);
      /*      const allWish = await this.wishService.findLast();*/

      await queryRunner.commitTransaction();

      /*      return {
              newOffer: newOffer,
              allWish: allWish,
            };*/
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async find(id?: number): Promise<Offer[]> {
    const options: FindManyOptions<Offer> = {
      order: { createdAt: 'desc' },
      where: {
        hidden: false,
      },
      relations: [
        'user',
        'user.wishlists',
        'user.wishlists.owner',
        //todo add wishlists
        //'user.wishlists.items',
      ],
    };

    if (id !== undefined) {
      options.where = {
        id: id,
      };
    }

    return await this.offersRepository.find(options);
  }

  findAll() {
    return this.find();
  }

  async findOne(id: number) {
    const test = await this.find(id);
    console.log('test', test);
    return test;
  }
}
