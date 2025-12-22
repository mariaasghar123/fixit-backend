import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { Subscription } from './entities/subscription.entity';
import { SubscriptionPlan } from './entities/subscription-plan.entity';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { User } from 'src/auth/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [TypeOrmModule.forFeature([Subscription, SubscriptionPlan, User]), JwtModule.register({
      secret: process.env.JWT_SECRET || 'defaultSecret', // apna secret use karo
      signOptions: { expiresIn: '1h' },
    }),],
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService, JwtAuthGuard],
  exports:[TypeOrmModule]
})
export class SubscriptionsModule {}
