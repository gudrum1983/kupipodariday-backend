import { Entity, OneToMany } from 'typeorm';
import { Wish } from '../../wishes/entities/wish.entity';
import { BaseEntityWishWithOwner } from '../../baseEntity/entities/BaseEntityWishWithOwner.entity';

@Entity()
export class Wishlist extends BaseEntityWishWithOwner {
  @OneToMany(() => Wish, (wish) => wish.id)
  items: Wish[]; // содержит набор ссылок на подарки.
}
