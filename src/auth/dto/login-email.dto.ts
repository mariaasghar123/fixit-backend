import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginEmailDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty({ enum: ['user', 'contractor'] })
  role: 'user' | 'contractor';
}
