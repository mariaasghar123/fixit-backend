import { Controller, Post, Req, Res } from '@nestjs/common';
import Stripe from 'stripe';
import { PaymentsService } from './payments.service';
import { Subscription } from '../subscriptions/entities/subscription.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionStatus } from '../subscriptions/entities/subscription-status.enum';

@Controller('webhooks')
export class WebhooksController {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepo: Repository<Subscription>,
  ) {
    const stripeSecret = process.env.STRIPE_SECRET_KEY;
if (!stripeSecret) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

this.stripe = new Stripe(stripeSecret, {
  apiVersion: '2025-12-15.clover',
});

  }

  @Post('payment-success')
  async handlePaymentSuccess(@Req() req, @Res() res) {
    const event = req.body;

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const subscriptionId = paymentIntent.metadata.subscription_id;

      const subscription = await this.subscriptionRepo.findOne({
        where: { id: subscriptionId },
        relations: ['plan', 'contractor'],
      });

      if (subscription) {
        subscription.status = SubscriptionStatus.ACTIVE;
        subscription.start_date = new Date();
        subscription.end_date = new Date(new Date().setMonth(new Date().getMonth() + 1));
        await this.subscriptionRepo.save(subscription);
      }
    }

    return res.json({ received: true });
  }
}
