import { ApiProperty, PickType } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

export class SigninUserDto extends PickType(User, [
  'username',
  'password',
] as const) {}

export class SigninUserResponseDto {
  @ApiProperty()
  access_token: string;
}
