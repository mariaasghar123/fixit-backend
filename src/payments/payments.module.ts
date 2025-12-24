import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtModule } from '@nestjs/jwt';
import { PaymentsController } from './payments.controller';
import { WebhooksController } from './webhooks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from '../subscriptions/entities/subscription.entity';
import { SubscriptionPlan } from '../subscriptions/entities/subscription-plan.entity';

import { User } from '../users/user.entity';
import { Payment } from './entities/payment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscription, SubscriptionPlan, User, Payment]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [PaymentsController, WebhooksController],
  providers: [PaymentsService],
})
  export class PaymentsModule {}
