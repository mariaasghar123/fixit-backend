import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('locations')
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number; // ⚡ must match property in TypeORM

  @Column('numeric')
  latitude: number;

  @Column('numeric')
  longitude: number;

  @Column({ default: false })
  enabled: boolean;

  @CreateDateColumn()
  updated_at: Date;
}
