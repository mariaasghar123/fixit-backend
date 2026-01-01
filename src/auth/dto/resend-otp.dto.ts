import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsIn } from 'class-validator';

export class ResendOtpDto {
  @ApiProperty({ example: 'test@gmail.com OR 03001234567' })
  @IsNotEmpty()
  identifier: string;

}
