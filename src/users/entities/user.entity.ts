import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Wish } from '../../wishes/entities/wish.entity';
import { IsEmail, IsNotEmpty, IsUrl, Length } from 'class-validator';
import {
  maxLimTextUserName,
  minLimText,
  textAbout,
  defaultAvatar,
} from '../../../utils/constants';
import { Offer } from '../../offers/entities/offer.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';
import { BaseEntityWithIdAndTime } from '../../baseEntity/entities/BaseEntityWithIdAndTime.entity';

@Entity()
export class User extends BaseEntityWithIdAndTime {
  @Column({
    type: 'varchar',
    unique: true,
  })
  @Length(minLimText, maxLimTextUserName) // Устанавливаем минимальную и максимальную длину строки
  // @IsNotEmpty() // Указываем, что поле не может быть пустым - то есть должно быть обязательным
  username: string;

  @Column({
    type: 'varchar',
    default: textAbout,
  })
  @Length(minLimText, maxLimTextUserName)
  about: string;

  @Column({ default: defaultAvatar })
  @IsUrl()
  avatar: string;

  @Column({ unique: true }) // Указываем, что значение должно быть уникальным
  @IsEmail() // Проверяем, что значение соответствует формату email
  email: string;

  @Column()
  @IsNotEmpty()
  password: string;

  @OneToMany(() => Wish, (wishes) => wishes.owner)
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @OneToMany(() => Wishlist, (wishlists) => wishlists.owner)
  wishlists: Wishlist[];
}
