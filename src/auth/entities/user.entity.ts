import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn , OneToMany} from 'typeorm';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  full_name: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ unique: true, nullable: true })
  phone_number: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: ['user', 'contractor'] })
  role: 'user' | 'contractor';

  @Column({ default: false })
  is_verified: boolean;

  @CreateDateColumn()
  created_at: Date;

  // 🔹 inverse side for Subscription#contractor
  @OneToMany(() => Subscription, (subscription) => subscription.contractor)
  subscriptions: Subscription[];
}