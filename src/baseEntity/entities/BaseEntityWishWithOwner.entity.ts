import { ManyToOne } from 'typeorm';
import { BaseEntityWithIdAndTime } from './BaseEntityWithIdAndTime.entity';
import { User } from '../../users/entities/user.entity';

export abstract class BaseEntityWishWithOwner extends BaseEntityWithIdAndTime {
  @ManyToOne(() => User, (owner) => owner.wishes)
  owner: User;
}
