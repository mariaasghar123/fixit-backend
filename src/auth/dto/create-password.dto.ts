import { ApiProperty } from '@nestjs/swagger';
import { MinLength } from 'class-validator';

export class CreatePasswordDto {
  @ApiProperty()
  temp_token: string;

  @ApiProperty()
  @MinLength(6)
  password: string;

  @ApiProperty()
  confirm_password: string;
}
