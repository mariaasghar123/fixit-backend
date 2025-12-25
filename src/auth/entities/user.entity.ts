import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn , OneToMany} from 'typeorm';
import { Subscription } from 'src/subscriptions/entities/subscription.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  // user.entity.ts
  @Column({
  type: 'enum',
  enum: ['pending', 'active'],
  default: 'pending',
})
status: 'pending' | 'active';

@Column({ type: 'varchar',nullable: true })
otp_code: string | null;

@Column({ type: 'timestamp', nullable: true })
otp_expires_at: Date | null;


 @Column({
    type: 'enum',
    enum: ['local', 'google', 'facebook', 'apple'],
    default: 'local',
  })
  provider: 'local' | 'google' | 'facebook' | 'apple';

@Column({ nullable: true })
provider_id: string;


  @Column()
  full_name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone_number: string;

  @Column({nullable:true})
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