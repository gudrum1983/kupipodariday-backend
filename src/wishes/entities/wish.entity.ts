import { Column, Entity, OneToMany } from 'typeorm';
import { Offer } from '../../offers/entities/offer.entity';
import { IsNotEmpty, IsNumber, IsUrl } from 'class-validator';
import { BaseEntityWishWithOwner } from '../../baseEntity/entities/BaseEntityWishWithOwner.entity';

@Entity()
export class Wish extends BaseEntityWishWithOwner {
  @Column({
    type: 'varchar',
  })
  @IsUrl()
  link: string;

  @Column()
  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 2,
  })
  price: string;

  @Column()
  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 2,
  })
  raised: string;

  @Column({
    type: 'varchar',
    length: 1024,
  })
  @IsNotEmpty()
  description: string;

  @Column()
  copied: number;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];
}
