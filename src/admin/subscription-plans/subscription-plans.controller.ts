import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { SubscriptionPlansService } from './subscription-plans.service';
import { CreateSubscriptionPlanDto } from './dto/create-subscription-plan.dto';
import { UpdateSubscriptionPlanDto } from './dto/update-subscription-plan.dto';

@ApiTags('Admin - Subscription Plans')
@Controller('admin/subscription-plans')
export class SubscriptionPlansController {
  constructor(
    private readonly plansService: SubscriptionPlansService,
  ) {}

  // 🔹 CREATE PLAN
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create subscription plan (Admin)' })
  @ApiBody({ type: CreateSubscriptionPlanDto })
  @ApiResponse({
    status: 201,
    description: 'Subscription plan created successfully',
    schema: {
      example: {
        statusCode: 201,
        message: 'Subscription plan created successfully',
        data: {
          id: 'uuid-plan-123',
          name: 'Basic Plan',
          price: 39.99,
          currency: 'USD',
          billing_cycle: 'monthly',
          features: ['10 bids', 'Priority listing'],
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() dto: CreateSubscriptionPlanDto) {
    return this.plansService.create(dto);
  }

  // 🔹 GET ALL PLANS
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all subscription plans (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Plans fetched successfully',
    schema: {
      example: {
        statusCode: 200,
        data: [],
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findAll() {
    return this.plansService.findAll();
  }

  // 🔹 GET SINGLE PLAN
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get single subscription plan (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Plan fetched successfully',
  })
  @ApiResponse({ status: 404, description: 'Subscription plan not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id') id: string) {
    return this.plansService.findOne(id);
  }

  // 🔹 UPDATE PLAN
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update subscription plan (Admin)' })
  @ApiBody({ type: UpdateSubscriptionPlanDto })
  @ApiResponse({
    status: 200,
    description: 'Subscription plan updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Subscription plan not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateSubscriptionPlanDto,
  ) {
    return this.plansService.update(id, dto);
  }

  // 🔹 DELETE PLAN
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete subscription plan (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Subscription plan deleted successfully',
    schema: {
      example: {
        statusCode: 200,
        message: 'Subscription plan deleted successfully',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Subscription plan not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id') id: string) {
    return this.plansService.remove(id);
  }
}
