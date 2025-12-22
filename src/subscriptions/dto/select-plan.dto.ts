import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SelectPlanDto {
   @ApiProperty({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'Selected subscription plan ID',
  })
  @IsUUID()
  plan_id: string;
}
