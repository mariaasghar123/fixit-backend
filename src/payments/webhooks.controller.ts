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
      throw new Error(
        'STRIPE_SECRET_KEY is not defined in environment variables',
      );
    }

    this.stripe = new Stripe(stripeSecret, {
      apiVersion: '2025-12-15.clover',
    });
  }

  // @Post('payment-success')
  // async handlePaymentSuccess(@Req() req, @Res() res) {
  //   const event = req.body;

  //   if (event.type === 'payment_intent.succeeded') {
  //     const paymentIntent = event.data.object as Stripe.PaymentIntent;
  //     const subscriptionId = paymentIntent.metadata.subscription_id;

  //     const subscription = await this.subscriptionRepo.findOne({
  //       where: { id: subscriptionId },
  //       relations: ['plan', 'contractor'],
  //     });

  //     if (subscription) {
  //       subscription.status = SubscriptionStatus.ACTIVE;
  //       subscription.start_date = new Date();
  //       subscription.end_date = new Date(new Date().setMonth(new Date().getMonth() + 1));
  //       await this.subscriptionRepo.save(subscription);
  //     }
  //   }

  //   return res.json({ received: true });
  // }
 @Post('stripe')
async handleStripeWebhook(@Req() req, @Res() res) {
  console.log('✅ Webhook endpoint HIT!');
  console.log('✅ Request headers:', req.headers);
  console.log('✅ Request body type:', typeof req.body);
  console.log('✅ Request body length:', req.body?.length || 0);
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not defined');
  }

  let event: Stripe.Event;
  
  try {
    // ✅ Get the raw body as Buffer from req.body
    const rawBody = req.body; // This is already a Buffer due to bodyParser.raw()
    
    // ✅ Convert to string for logging if needed
    console.log('Raw webhook body:', rawBody.toString());
    
    // ✅ Pass the Buffer directly to constructEvent
    event = this.stripe.webhooks.constructEvent(
      rawBody,  // Pass Buffer, not string
      sig as string,
      webhookSecret
    );
  } catch (err) {
    console.error('Webhook verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('Webhook verified successfully. Event type:', event.type);

  // Handle the event types...
  // ... rest of your existing event handling code


    // ✅ PAYMENT SUCCESS
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      const subscriptionId = paymentIntent.metadata.subscriptionId;

      const subscription = await this.subscriptionRepo.findOne({
        where: { id: subscriptionId },
      });

      if (subscription) {
        subscription.status = SubscriptionStatus.ACTIVE;
        subscription.start_date = new Date();

        // example: 1 month subscription
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);
        subscription.end_date = endDate;
        await this.subscriptionRepo.save(subscription);
      }
    }

    //  PAYMENT FAILED
    if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      console.log('Payment failed:', paymentIntent.id);
    }

    return res.json({ received: true, test: 'webhook received' });
  }
}
