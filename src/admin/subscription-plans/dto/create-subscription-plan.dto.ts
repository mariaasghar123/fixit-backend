import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  IsIn,
  IsBoolean,
} from 'class-validator';

export class CreateSubscriptionPlanDto {
  @ApiProperty({ example: 'Basic Plan' })
  @IsString()
  name: string;

  @ApiProperty({ example: 39.99 })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 'USD' })
  @IsString()
  currency: string;

  @ApiProperty({ example: 'monthly', enum: ['monthly', 'yearly'] })
  @IsIn(['monthly', 'yearly'])
  billing_cycle: 'monthly' | 'yearly';

  @ApiProperty({
    example: ['10 job bids', 'Priority support'],
    required: false,
  })
  @IsArray()
  @IsOptional()
  features?: string[];

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
