import { IsUUID, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {

  @ApiProperty({
    example: 'uuid-subscription-123',
    description: 'Subscription ID for which payment is created',
  })
  @IsUUID()
  subscription_id: string;

  @ApiProperty({
    example: 'card',
    description: 'Payment method type',
  })
  @IsIn(['card'])
  payment_method: 'card';
}
