import { Injectable, BadRequestException } from '@nestjs/common';
import Stripe from 'stripe';
import { Subscription } from '../subscriptions/entities/subscription.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionStatus } from 'src/subscriptions/entities/subscription-status.enum';
@Injectable()
export class PaymentsService {
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

  async createPaymentIntent(subscriptionId: string) {
    const subscription = await this.subscriptionRepo.findOne({
      where: { id: subscriptionId },
      relations: ['plan', 'contractor'],
    });

    if (!subscription) throw new BadRequestException('Subscription not found');

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: subscription.plan.price * 100, // in cents
      currency: 'usd',
      metadata: { subscription_id: subscription.id },
    });

    return {
      payment_intent_id: paymentIntent.id,
      client_secret: paymentIntent.client_secret,
    };
  }
}
