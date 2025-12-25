import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsIn, Length, Matches } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({
    example: 'user@email.com OR 03001234567',
    description: 'Email or phone number used during signup',
  })
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @ApiProperty({ example: '12345' })
  @IsString()
  @Length(5, 5)
  @Matches(/^\d+$/, { message: 'OTP must contain only numbers' })
  otp: string;

  @ApiProperty({ enum: ['user', 'contractor'] })
  @IsIn(['user', 'contractor'])
  role: 'user' | 'contractor';
}
