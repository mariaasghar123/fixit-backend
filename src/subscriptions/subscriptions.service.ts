import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subscription } from './entities/subscription.entity';
import { SubscriptionPlan } from './entities/subscription-plan.entity';
import { User } from '../auth/entities/user.entity';
import { ForbiddenException } from '@nestjs/common';
import { SubscriptionStatus } from './entities/subscription-status.enum';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepo: Repository<Subscription>,

    @InjectRepository(SubscriptionPlan)
    private readonly planRepo: Repository<SubscriptionPlan>,
  ) {}

  // 🔹 Helper method (PRIVATE)
  private calculateEndDate(
    billingCycle: 'monthly' | 'yearly',
  ): Date {
    const date = new Date();

    if (billingCycle === 'monthly') {
      date.setMonth(date.getMonth() + 1);
    }

    if (billingCycle === 'yearly') {
      date.setFullYear(date.getFullYear() + 1);
    }

    return date;
  }


  // 🔹 Contractor – View Plans
  async getPlans(): Promise<SubscriptionPlan[]> {
    return this.planRepo.find();
  }

  // 🔹 Contractor – Select Plan
  async selectPlan(user: User, planId: string) {
    const plan = await this.planRepo.findOne({ where: { id: planId } });

    if (!plan) {
      throw new NotFoundException('Subscription plan not found');
    }

    const activeSubscription = await this.subscriptionRepo.findOne({
      where: { contractor: user, status: SubscriptionStatus.ACTIVE },
    });

    if (activeSubscription) {
      throw new BadRequestException(
        'You already have an active subscription',
      );
    }

    const subscription = this.subscriptionRepo.create({
      contractor: user,
      plan,
      status: SubscriptionStatus.PENDING,
    });

    return this.subscriptionRepo.save(subscription);
  }

 // 🔹 Contractor – Current Subscription
async getCurrentSubscription(user: User) {
  return this.subscriptionRepo.findOne({
    where: { contractor: user, status: SubscriptionStatus.ACTIVE },
    relations: ['plan'],
  });
}
  async cancelSubscription(user: User) {
  const subscription = await this.subscriptionRepo.findOne({
    where: {
      contractor: user,
      status: SubscriptionStatus.ACTIVE,
    },
  });

  if (!subscription) {
    throw new NotFoundException(
      'No active subscription to cancel',
    );
  }

  subscription.status = SubscriptionStatus.CANCELLED;
          subscription.end_date = new Date();
  return this.subscriptionRepo.save(subscription);
  }

  async renewSubscription(user: User) {
  // 1️⃣ Check active subscription
  const activeSubscription = await this.subscriptionRepo.findOne({
    where: {
      contractor: user,
      status: SubscriptionStatus.ACTIVE,
    },
  });

  if (activeSubscription) {
    throw new BadRequestException(
      'Active subscription already exists',
    );
  }

  // 2️⃣ Get last subscription
  const lastSubscription = await this.subscriptionRepo.findOne({
    where: { contractor: user },
    order: { end_date: 'DESC' },
    relations: ['plan'],
  });

  if (!lastSubscription) {
    throw new NotFoundException(
      'No previous subscription found to renew',
    );
  }

  // 3️⃣ Create new subscription
  const newSubscription = this.subscriptionRepo.create({
    contractor: user,
    plan: lastSubscription.plan,
    status: SubscriptionStatus.ACTIVE,
    start_date: new Date(),
    end_date: this.calculateEndDate(
      lastSubscription.plan.billing_cycle,
    ),
  });

  await this.subscriptionRepo.save(newSubscription);

  return {
    statusCode: 200,
    message: 'Subscription renewed successfully',
    data: {
      subscription_id: newSubscription.id,
      status: newSubscription.status,
      start_date: newSubscription.start_date,
      end_date: newSubscription.end_date,
    },
  };
}
}
