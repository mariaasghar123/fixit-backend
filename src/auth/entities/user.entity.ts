import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
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
}
