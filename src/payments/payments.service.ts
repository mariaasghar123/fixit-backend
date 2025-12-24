import { Injectable, BadRequestException } from '@nestjs/common';
import Stripe from 'stripe';
import { Subscription } from '../subscriptions/entities/subscription.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SubscriptionStatus } from 'src/subscriptions/entities/subscription-status.enum';
import { Payment } from './entities/payment.entity';
@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepo: Repository<Subscription>,
    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>
  ) {
    const stripeSecret = process.env.STRIPE_SECRET_KEY;
if (!stripeSecret) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

this.stripe = new Stripe(stripeSecret, {
  apiVersion: '2025-12-15.clover',
});
  }
  
   async createPayment(userId: string, subscriptionId: string, paymentMethod: string) {
    // Fetch subscription from DB
    const subscription = await this.subscriptionRepo.findOne({ where: { id: subscriptionId } });
    if (!subscription) throw new Error('Subscription plan not found');

    // Create PaymentIntent
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: subscription.price * 100,
      currency: 'usd',
      payment_method_types: [paymentMethod],
      metadata: { userId, subscriptionId },
    });
    // 2️⃣ SAVE PAYMENT (PENDING)
  await this.paymentRepo.save({
    subscription,
    payment_provider: 'stripe',
    payment_intent_id: paymentIntent.id,
    amount: subscription.price,
    status: 'pending',
  });

    return {
      payment_intent_id: paymentIntent.id,
      client_secret: paymentIntent.client_secret,
    };
  }
}
