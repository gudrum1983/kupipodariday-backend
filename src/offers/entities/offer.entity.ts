import { Column, Entity, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';
import { IsNumber } from 'class-validator';
import { BaseEntityWithIdAndTime } from '../../baseEntity/entities/BaseEntityWithIdAndTime.entity';

@Entity()
export class Offer extends BaseEntityWithIdAndTime {
  @Column()
  @IsNumber({
    allowNaN: false,
    allowInfinity: false,
    maxDecimalPlaces: 2,
  })
  amount: number; //сумма заявки, округляется до двух знаков после запятой;

  @Column({ default: false })
  hidden: boolean; // флаг, который определяет показывать ли информацию о скидывающемся в списке. По умолчанию равен false.

  @ManyToOne(() => Wish, (item) => item.id)
  item: Wish; // item содержит ссылку на товар;

  @ManyToOne(() => User, (user) => user.offers)
  user: User; //  ссылка на ид пользователя желающего скинуться
}
