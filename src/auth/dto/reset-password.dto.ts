import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  reset_token: string;

  @ApiProperty()
  @IsNotEmpty()
  otp: string;

  @ApiProperty()
  @IsNotEmpty()
  new_password: string;

  @ApiProperty()
  @IsNotEmpty()
  confirm_password: string;
}
