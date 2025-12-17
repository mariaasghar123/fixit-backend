import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('password_resets')
export class PasswordReset {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  identifier: string; // email or phone

  @Column()
  otp: string;

  @Column({ unique: true })
  reset_token: string;

  @Column({ type: 'enum', enum: ['admin', 'user', 'contractor'] })
  role: 'admin' | 'user' | 'contractor';

  @Column({ default: false })
  is_used: boolean;

  @CreateDateColumn()
  created_at: Date;
}
