import { Column, Entity, OneToMany } from 'typeorm';
import { Wish } from '../../wishes/entities/wish.entity';
import { BaseEntityWishWithOwner } from '../../baseEntity/entities/BaseEntityWishWithOwner.entity';
import { ApiExtraModels, ApiProperty, ApiTags } from '@nestjs/swagger';
import { IsString, IsUrl, Length } from 'class-validator';
import { wishNameLengthMax, wishNameLengthMin } from '../../../utils/constants';

@ApiTags("Shema")
@Entity()
export class Wishlist extends BaseEntityWishWithOwner {
  @ApiProperty({
    description: 'Наименование коллекции подарков',
  })
  @IsString()
  @Column()
  @Length(wishNameLengthMin, wishNameLengthMax)
  name: string;

  @ApiProperty({
    description: 'Картинка коллекции подарков',
  })
  @Column()
  @IsUrl()
  image: string;

  @OneToMany(() => Wish, (wish) => wish.id)
  items: Wish[]; // содержит набор ссылок на подарки.
}
