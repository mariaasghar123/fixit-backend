import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createPayment(@Body() body: { subscription_id: string }) {
    const { subscription_id } = body;
    return this.paymentsService.createPaymentIntent(subscription_id);
  }
}
