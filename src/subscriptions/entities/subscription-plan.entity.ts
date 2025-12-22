import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('subscription_plans')
export class SubscriptionPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  currency: string;

  @Column()
  billing_cycle: 'monthly' | 'yearly';

  @Column('json', { nullable: true })
  features: string[];

  @Column({ default: true })
  is_active: boolean;
}
