// src/profile/entities/profile.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { User } from 'src/auth/entities/user.entity';
import { Category } from 'src/categories/entities/category.entity';

@Entity()
export class Profile {
  @ApiProperty({
    example: 'a3b2c1d4-e111-4f55-9c2a-123456789abc',
    description: 'Unique profile ID',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => User, user => user.profile, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  // -----------------------
  // Basic Info
  // -----------------------
  @ApiProperty({
    example: 'John',
    description: 'Profile owner first name',
  })
  @Column()
  owner_first_name: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Profile owner last name',
  })
  @Column()
  owner_last_name: string;

  @ApiPropertyOptional({
    example: '90210',
    description: 'Business zip code',
  })
  @Column({ nullable: true })
  business_zip?: string;

  // -----------------------
  // Expertise / Categories
  // -----------------------
  @ApiProperty({
    description: 'Selected expertise categories',
    type: [Category],
    example: [
      { id: 'uuid-1', name: 'Plumbing' },
      { id: 'uuid-2', name: 'Electrical' },
    ],
  })
  @ManyToMany(() => Category, { eager: true })
  @JoinTable()
  categories: Category[];

  // -----------------------
  // Work Radius
  // -----------------------
  @ApiPropertyOptional({
    example: 'distance',
    description: 'Radius type (distance / city / nationwide)',
  })
  @Column({ nullable: true })
  radius_type?: string;

  @ApiPropertyOptional({
    example: 25,
    description: 'Work radius in miles',
  })
  @Column({ type: 'float', nullable: true })
  distance_miles?: number;

  // -----------------------
  // Pricing
  // -----------------------
  @ApiPropertyOptional({
    example: 80,
    description: 'Hourly service rate',
  })
  @Column({ type: 'float', nullable: true })
  hourly_rate?: number;

  // -----------------------
  // Description
  // -----------------------
  @ApiPropertyOptional({
    example: 'I have 10 years of experience in plumbing and electrical work.',
    description: 'Why should clients hire you?',
  })
  @Column({ nullable: true })
  description?: string;

  // -----------------------
  // Availability
  // -----------------------
  @ApiPropertyOptional({
    example: ['Mon', 'Tue', 'Wed'],
    description: 'Available working days',
  })
  @Column('simple-array', { nullable: true })
  available_days?: string[];

  @ApiPropertyOptional({
    example: ['09:00-17:00'],
    description: 'Available time slots',
  })
  @Column('simple-array', { nullable: true })
  time_slots?: string[];

  // -----------------------
  // Media
  // -----------------------
  @ApiPropertyOptional({
    example: [
      'https://cdn.app.com/portfolio/img1.jpg',
      'https://cdn.app.com/portfolio/img2.jpg',
    ],
    description: 'Portfolio image URLs',
  })
  @Column('simple-array', { nullable: true })
  portfolio_images?: string[];

  @ApiPropertyOptional({
    example: 'https://cdn.app.com/profile/photo.jpg',
    description: 'Profile photo or business logo',
  })
  @Column({ nullable: true })
  profile_photo?: string;

  @ApiPropertyOptional({
    example: 'https://cdn.app.com/license/license.jpg',
    description: 'Contractor license image',
  })
  
  @Column({ nullable: true })
  license_photo?: string;

  @ApiPropertyOptional({
  example: 100,
  description: 'Profile completion step',
})
@Column({ type: 'int', default: 0 })
profile_step: number;

}
