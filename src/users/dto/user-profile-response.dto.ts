import { OmitType } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

export class UserProfileResponseDto extends OmitType(User, [
  'password',
  'wishes',
  'wishlists',
  'offers',
] as const) {
}

