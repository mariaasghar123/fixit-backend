import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupEmailDto {
  @ApiProperty()
  @IsNotEmpty()
  full_name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({ enum: ['user', 'contractor'] })
  role: 'user' | 'contractor';

  @ApiProperty()
  @MinLength(6)
  password: string;

  @ApiProperty()
  confirm_password: string;
}
