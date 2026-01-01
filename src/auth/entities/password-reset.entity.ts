import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('password_resets')
export class PasswordReset {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  identifier: string; // email or phone

  @Column()
  otp: string;

  @Column({ type: 'timestamp' })
otp_expires_at: Date;

@Column({ type: 'timestamp', nullable: true })
used_at: Date | null;

  @Column({ unique: true })
  reset_token: string;

  @Column({ type: 'enum', enum: ['admin', 'user', 'contractor'] })
  role: 'admin' | 'user' | 'contractor';

  @Column({ default: false })
  is_used: boolean;

  @CreateDateColumn()
  created_at: Date;
}
