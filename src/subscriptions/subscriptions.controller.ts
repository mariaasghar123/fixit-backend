import {
  Controller,
  Get,
  Post,
  Req,
  Body,
  Patch,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { SubscriptionsService } from './subscriptions.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { SelectPlanDto } from './dto/select-plan.dto';
import { Subscription } from './entities/subscription.entity';
import type { RequestWithUser } from 'src/types/request-with-user.interface';

@ApiTags('Contractor - Subscriptions')
@Controller('subscriptions')
@UseGuards(JwtAuthGuard)
export class SubscriptionsController {
  constructor(
    private readonly subscriptionsService: SubscriptionsService,
  ) {}

  // 🔹 View Plans
  // @Get('plans')
  // @ApiOperation({ summary: 'View available subscription plans' })
  // @ApiResponse({ status: 200, description: 'Plans fetched successfully' })
  // async getPlans() {
  //   return {
  //     statusCode: 200,
  //     data: await this.subscriptionsService.getPlans(),
  //   };
  // }
  @Get('plans')
@UseGuards(JwtAuthGuard)
@ApiOperation({ summary: 'Get subscription plans (Contractor)' })
@ApiResponse({
  status: 200,
  description: 'Subscription plans fetched successfully',
  schema: {
    example: {
      statusCode: 200,
      data: [
        {
          id: 'uuid-plan',
          name: 'Basic Plan',
          price: 29.99,
          billing_cycle: 'monthly',
          features: ['Feature 1', 'Feature 2'],
        },
      ],
    },
  },
})
async getPlans() {
  return {
    statusCode: 200,
    data: await this.subscriptionsService.getPlans(),
  };
}

  // 🔹 Select Plan
  @Post('select')
  @HttpCode(HttpStatus.PAYMENT_REQUIRED)
  @ApiOperation({ summary: 'Select a subscription plan' })
  @ApiBody({ type: SelectPlanDto })
  @ApiResponse({
    status: 402,
    description: 'Plan selected, payment required',
  })
  async selectPlan(
    @Req() req: RequestWithUser,
    @Body() dto: SelectPlanDto,
  ) {
    const subscription = await this.subscriptionsService.selectPlan(
      req.user,
      dto.plan_id,
    );

    return {
      statusCode: 402,
      message: 'Subscription plan selected successfully',
      data: {
        subscription_id: subscription.id,
        status: subscription.status,
        plan: subscription.plan,
      },
      next_step: 'payment',
    };
  }

  // 🔹 Current Subscription
 @Get('current')
@ApiOperation({ summary: 'Get current active subscription (Contractor)' })
@ApiResponse({
  status: 200,
  description: 'Active subscription fetched successfully',
  schema: {
    example: {
      statusCode: 200,
      message: 'Active subscription fetched successfully',
      data: {
        subscription_id: 'uuid-subscription-123',
        status: 'active',
        plan: {
          id: 'uuid-plan-456',
          name: 'Pro Plan',
          price: 49.99,
          currency: 'USD',
          billing_cycle: 'monthly',
          features: ['Unlimited jobs', 'Priority support'],
        },
        start_date: '2025-01-01T00:00:00.000Z',
        end_date: '2025-02-01T00:00:00.000Z',
      },
    },
  },
})
@ApiResponse({
  status: 404,
  description: 'No active subscription found',
  schema: {
    example: {
      statusCode: 404,
      message: 'No active subscription found',
    },
  },
})
async getCurrent(@Req() req: RequestWithUser) {
  const subscription =
    await this.subscriptionsService.getCurrentSubscription(req.user);

  if (!subscription) {
    return {
      statusCode: 404,
      message: 'No active subscription found',
    };
  }

  return {
    statusCode: 200,
    message: 'Active subscription fetched successfully',
    data: {
      subscription_id: subscription.id,
      status: subscription.status,
      plan: {
        id: subscription.plan.id,
        name: subscription.plan.name,
        price: subscription.plan.price,
        currency: subscription.plan.currency,
        billing_cycle: subscription.plan.billing_cycle,
        features: subscription.plan.features,
      },
      start_date: subscription.start_date,
      end_date: subscription.end_date,
    },
  };
}

  @Patch('cancel')
  @UseGuards(JwtAuthGuard)
@ApiOperation({ summary: 'Cancel active subscription' })
@ApiResponse({
  status: 200,
  description: 'Subscription cancelled successfully',
})
@ApiResponse({
  status: 404,
  description: 'No active subscription found',
})
async cancel(@Req() req: RequestWithUser) {
  const subscription =
    await this.subscriptionsService.cancelSubscription(
      req.user,
    );

  return {
    statusCode: 200,
    message: 'Subscription cancelled successfully',
    data: {
      subscription_id: subscription.id,
      status: subscription.status,
    },
  };
}

@Patch('renew')
@UseGuards(JwtAuthGuard)
@ApiOperation({ summary: 'Renew subscription (Contractor)' })
@ApiResponse({
  status: 200,
  description: 'Subscription renewed successfully',
  schema: {
    example: {
      statusCode: 200,
      message: 'Subscription renewed successfully',
      data: {
        subscription_id: 'uuid-subscription-123',
        status: 'active',
        start_date: '2025-02-01T00:00:00.000Z',
        end_date: '2025-03-01T00:00:00.000Z',
      },
    },
  },
})
@ApiResponse({
  status: 404,
  description: 'No previous subscription found',
  schema: {
    example: {
      statusCode: 404,
      message: 'No previous subscription found',
    },
  },
})
async renew(@Req() req: RequestWithUser) {
  const result =
    await this.subscriptionsService.renewSubscription(req.user);

  return {
    statusCode: 200,
    message: 'Subscription renewed successfully',
    data: result,
  };
}


}