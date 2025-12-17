import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupPhoneDto {
  @ApiProperty()
  @IsNotEmpty()
  full_name: string;

  @ApiProperty()
  @IsNotEmpty()
  phone_number: string;

  @ApiProperty({ enum: ['user', 'contractor'] })
  role: 'user' | 'contractor';
}
