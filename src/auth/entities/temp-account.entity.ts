import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('temp_accounts')
export class TempAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  full_name: string;

  @Column({ unique: true })
  phone_number: string;

  @Column()
  otp: string;

  @Column({ unique: true })
  temp_token: string;

  @Column({ type: 'enum', enum: ['user', 'contractor'] })
  role: 'user' | 'contractor';

  @Column({ default: false })
  is_verified: boolean;

  @CreateDateColumn()
  created_at: Date;
}
