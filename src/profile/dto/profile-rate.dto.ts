import { IsOptional, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ProfileRateDto {
  @ApiPropertyOptional({
    example: 80,
    description: 'Hourly service rate',
  })
  @IsOptional()
  @IsNumber()
  hourly_rate?: number;
}
