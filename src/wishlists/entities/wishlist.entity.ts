import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Wish } from '../../wishes/entities/wish.entity';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { IsNotEmpty, IsString, IsUrl, Length } from 'class-validator';
import { wishNameLengthMax, wishNameLengthMin } from '../../../utils/constants';
import { BaseEntityWithIdAndTime } from '../../baseEntity/entities/BaseEntityWithIdAndTime.entity';

@Entity()
export class Wishlist extends BaseEntityWithIdAndTime {
  @ApiProperty({
    description: 'Наименование коллекции подарков',
  })
  @IsString()
  @Column()
  @Length(wishNameLengthMin, wishNameLengthMax)
  name: string;

  @ApiProperty({
    description: 'Обложка для коллекции',
  })
  @IsNotEmpty()
  @Column()
  @IsUrl()
  image: string;

  @ApiProperty({
    description: 'Список подарков',
    type: () => Wish,
    isArray: true,
  })
  @OneToMany(() => Wish, (wish) => wish.id)
  items: Wish[]; // содержит набор ссылок на подарки.

  @ApiProperty({ type: () => User, description: 'Владелец' })
  @ManyToOne(() => User, (owner) => owner.wishlists)
  owner: User;
}
