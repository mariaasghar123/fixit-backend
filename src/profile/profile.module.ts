// src/profile/profile.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './entities/profile.entity';
import { Category } from '../categories/entities/category.entity';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Profile, Category]), // Profile aur Category repo
    AuthModule, // JwtModule exported from AuthModule
  ],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
