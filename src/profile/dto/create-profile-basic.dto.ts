import { IsNotEmpty, IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProfileBasicDto {
  @ApiProperty({
    example: 'Jane',
    description: 'Business owner first name',
  })
  @IsNotEmpty()
  @IsString()
  owner_first_name: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Business owner last name',
  })
  @IsNotEmpty()
  @IsString()
  owner_last_name: string;

  @ApiProperty({
    example: ['Plumbing', 'Electrical'],
    description: 'List of category NAMES selected by user/contractor.These names will be mapped to Category entities internally.',
    type: [String],
  })
  @IsArray()
  @IsNotEmpty()
  expertise: string[];

  @ApiProperty({
    example: '90210',
    description: 'Business zip code',
  })
  @IsNotEmpty()
  @IsString()
  business_zip: string;
}
