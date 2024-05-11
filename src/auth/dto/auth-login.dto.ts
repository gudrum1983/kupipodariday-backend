import { ApiProperty } from '@nestjs/swagger';

export class AuthLoginDto {
  @ApiProperty()
  access_token: string;
}
