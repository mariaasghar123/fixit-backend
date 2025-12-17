import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsIn } from 'class-validator';

export class ResendOtpDto {
  @ApiProperty()
  @IsNotEmpty()
  temp_token: string;

  @ApiProperty({ enum: ['user', 'contractor'] })
  @IsIn(['user', 'contractor'])
  role: 'user' | 'contractor';
}
