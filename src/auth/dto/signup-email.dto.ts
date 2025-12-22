import { IsEmail, IsNotEmpty, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupEmailDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Full name is required' })
  full_name: string;

  @ApiProperty()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @ApiProperty({ enum: ['user', 'contractor'], default: 'user' })
  role: 'user' | 'contractor' = 'user';

  // // Password optional in first step (OTP verification first)
  // @ApiProperty({ required: false })
  // @IsOptional()
  // @MinLength(6, { message: 'Password must be at least 6 characters' })
  // password?: string;

  // @ApiProperty({ required: false })
  // @IsOptional()
  // confirm_password?: string;

  // Optional field for OTP verification
  // @ApiProperty({ required: false })
  // @IsOptional()
  // otp?: string;
}
