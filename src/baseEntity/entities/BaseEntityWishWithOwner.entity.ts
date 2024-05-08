import { Column, ManyToOne } from 'typeorm';
import { BaseEntityWithIdAndTime } from './BaseEntityWithIdAndTime.entity';
import { IsNotEmpty, IsUrl } from 'class-validator';
import { User } from '../../users/entities/user.entity';

export abstract class BaseEntityWishWithOwner extends BaseEntityWithIdAndTime {
  @Column({
    type: 'varchar',
    length: 250,
  })
  @IsNotEmpty()
  name: string;

  @Column({
    type: 'varchar',
  })
  @IsUrl()
  image: string;

  @ManyToOne(() => User, (owner) => owner.wishes)
  owner: User;
}
