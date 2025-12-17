import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'john@example.com OR +1234567890' })
  @IsNotEmpty()
  @IsString()
  identifier: string; // email OR phone

  @ApiProperty({ enum: ['admin', 'user', 'contractor'] })
  @IsIn(['admin', 'user', 'contractor'])
  role: 'admin' | 'user' | 'contractor';
}
