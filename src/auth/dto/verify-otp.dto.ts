import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsIn, Length, Matches } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({ example: 'temp_xyz_123' })
  @IsString()
  @IsNotEmpty()
  temp_token: string;

  @ApiProperty({ example: '12345' })
  @IsString()
  @Length(5, 5)
  @Matches(/^\d+$/, { message: 'OTP must contain only numbers' })
  otp: string;

  @ApiProperty({ enum: ['user', 'contractor'] })
  @IsIn(['user', 'contractor'])
  role: 'user' | 'contractor';
}
