import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProfileRadiusDto {
  @ApiProperty({
    example: 'distance',
    description: 'Radius type (distance / city / nationwide)',
  })
  @IsNotEmpty()
  @IsString()
  radius_type: string;

  @ApiPropertyOptional({
    example: 25,
    description: 'Work radius in miles (required if radius_type = distance)',
  })
  @IsOptional()
  @IsNumber()
  distance_miles?: number;
}
