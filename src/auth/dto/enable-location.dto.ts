import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsBoolean, IsNumber } from 'class-validator';

export class EnableLocationDto {
  @ApiProperty({ example: 40.7128 })
  @IsNotEmpty()
  @IsNumber()
  latitude: number;

  @ApiProperty({ example: -74.0060})
  @IsNotEmpty()
  @IsNumber()
  longitude: number;

  @ApiProperty({ example: true })
  @IsNotEmpty()
  @IsBoolean()
  enabled: boolean;
}