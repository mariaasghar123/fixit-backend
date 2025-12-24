import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CreatePaymentDto } from './dto/create.payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

 @Post('create')
@UseGuards(JwtAuthGuard)
async createPayment(@Req() req, @Body() dto: CreatePaymentDto,) {
  return this.paymentsService.createPayment(req.user.id, dto.subscription_id, dto.payment_method);
}
}
