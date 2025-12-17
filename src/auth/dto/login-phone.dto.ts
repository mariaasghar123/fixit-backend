import { ApiProperty } from '@nestjs/swagger';

export class LoginPhoneDto {
  @ApiProperty()
  phone_number: string;

  @ApiProperty()
  password: string;

  @ApiProperty({ enum: ['user', 'contractor'] })
  role: 'user' | 'contractor';
}
