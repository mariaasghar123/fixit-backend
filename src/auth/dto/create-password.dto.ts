import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreatePasswordDto {
  @ApiProperty({
    example: 'user@email.com OR 03001234567',
    description: 'Email or phone number used during signup',
  })
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @ApiProperty({ example: 'Password@123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Password@123' })
  @IsString()
  confirm_password: string;
}
