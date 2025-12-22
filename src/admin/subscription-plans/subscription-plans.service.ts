import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionPlan } from 'src/subscriptions/entities/subscription-plan.entity';
import { CreateSubscriptionPlanDto } from './dto/create-subscription-plan.dto';
import { UpdateSubscriptionPlanDto } from './dto/update-subscription-plan.dto';

@Injectable()
export class SubscriptionPlansService {
  constructor(
    @InjectRepository(SubscriptionPlan)
    private readonly planRepo: Repository<SubscriptionPlan>,
  ) {}

  // 🔹 Create plan (ADMIN)
  async create(dto: CreateSubscriptionPlanDto) {
    const plan = this.planRepo.create(dto);
    await this.planRepo.save(plan);

    return {
      statusCode: 201,
      message: 'Subscription plan created successfully',
      data: plan,
    };
  }

  // 🔹 Get all plans
  async findAll() {
    const plans = await this.planRepo.find();

    return {
      statusCode: 200,
      data: plans,
    };
  }

  // 🔹 Get single plan
  async findOne(id: string) {
    const plan = await this.planRepo.findOne({ where: { id } });

    if (!plan) {
      throw new NotFoundException('Subscription plan not found');
    }

    return {
      statusCode: 200,
      data: plan,
    };
  }

  // 🔹 Update plan
  async update(id: string, dto: UpdateSubscriptionPlanDto) {
    const plan = await this.planRepo.findOne({ where: { id } });

    if (!plan) {
      throw new NotFoundException('Subscription plan not found');
    }

    Object.assign(plan, dto);
    await this.planRepo.save(plan);

    return {
      statusCode: 200,
      message: 'Subscription plan updated successfully',
      data: plan,
    };
  }

  // 🔹 Delete plan
  async remove(id: string) {
    const plan = await this.planRepo.findOne({ where: { id } });

    if (!plan) {
      throw new NotFoundException('Subscription plan not found');
    }

    await this.planRepo.remove(plan);

    return {
      statusCode: 200,
      message: 'Subscription plan deleted successfully',
    };
  }
}
