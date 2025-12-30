import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProfileDescriptionDto {
  @ApiProperty({
    example: 'I have over 10 years of experience in plumbing and electrical work.',
    description: 'Why should clients hire you?',
  })
  @IsNotEmpty()
  @IsString()
  description: string;
}
