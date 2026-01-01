// src/profile/profile.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

import { Profile } from './entities/profile.entity';
import { Category } from '../categories/entities/category.entity';
import { Role } from 'src/common/enums/role.enum';
import { User } from 'src/auth/entities/user.entity';

import { CreateProfileBasicDto } from './dto/create-profile-basic.dto';
import { ProfileRadiusDto } from './dto/profile-radius.dto';
import { ProfileRateDto } from './dto/profile-rate.dto';
import { ProfileDescriptionDto } from './dto/profile-description.dto';
import { ProfileAvailabilityDto } from './dto/profile-availability.dto';
import { ImageType } from 'src/common/enums/image-type.enum';
import { StorageService } from 'src/common/services/storage.service';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
      private readonly storageService: StorageService,
  ) {}

  // -------------------------
  // 1️⃣ Create OR Update Basic Profile (User + Contractor)
  // -------------------------
  async createOrUpdateBasic(dto: CreateProfileBasicDto, user: User) {
    let profile = await this.profileRepo.findOne({
      where: { user: { id: user.id } },
      relations: ['categories'],
    });

    if (!profile) profile = this.profileRepo.create({ user });

    profile.owner_first_name = dto.owner_first_name;
    profile.owner_last_name = dto.owner_last_name;
    profile.business_zip = dto.business_zip;

    if (user.role === Role.CONTRACTOR) {
      const categories = await this.categoryRepo.find({
        where: { name: In(dto.expertise) },
      });
      if (!categories.length) throw new NotFoundException('Invalid categories');
      profile.categories = categories;
    }

    return this.profileRepo.save(profile);
  }

  // -------------------------
  // 2️⃣ Work Radius (Contractor only)
  // -------------------------
  async setRadius(dto: ProfileRadiusDto, user: User) {
    this.ensureContractor(user);

    const profile = await this.getProfile(user.id);
    profile.radius_type = dto.radius_type;
    if (dto.distance_miles !== undefined) profile.distance_miles = dto.distance_miles;

    return this.profileRepo.save(profile);
  }

  // -------------------------
  // 3️⃣ Hourly Rate (Contractor only)
  // -------------------------
  async setRate(dto: ProfileRateDto, user: User) {
    this.ensureContractor(user);

    const profile = await this.getProfile(user.id);
    if (dto.hourly_rate !== undefined) profile.hourly_rate = dto.hourly_rate;

    return this.profileRepo.save(profile);
  }

  // -------------------------
  // 4️⃣ Description (Both)
  // -------------------------
  async setDescription(dto: ProfileDescriptionDto, user: User) {
    const profile = await this.getProfile(user.id);
    profile.description = dto.description;
    return this.profileRepo.save(profile);
  }

  // -------------------------
  // 5️⃣ Availability (Contractor only)
  // -------------------------
  async setAvailability(dto: ProfileAvailabilityDto, user: User) {
    this.ensureContractor(user);

    const profile = await this.getProfile(user.id);
    profile.available_days = dto.available_days;
    profile.time_slots = dto.time_slots;
    return this.profileRepo.save(profile);
  }

  // -------------------------
  // 6️⃣ Upload / Update License (Contractor only)
  // -------------------------
  async uploadLicense(file: any, userId: string) {
    const profile = await this.getProfile(userId);
    this.ensureContractor(profile.user);

    profile.license_photo = await this.storageService.upload(
      file,
    ImageType.LICENSE,
    );
    return this.profileRepo.save(profile);
  }

  // -------------------------
  // 7️⃣ Upload / Update Profile Photo (Both)
  // -------------------------
  async uploadProfilePhoto(file: any, userId: string) {
    const profile = await this.getProfile(userId);
    profile.profile_photo = await this.storageService.upload(
      file,
    ImageType.PROFILE,
    );
    return this.profileRepo.save(profile);
  }

  // -------------------------
  // 8️⃣ Upload / Update Portfolio (Contractor only)
  // -------------------------
  async uploadPortfolio(files: any[], userId: string) {
    const profile = await this.getProfile(userId);
    this.ensureContractor(profile.user);

   const urls: string[] = [];
  for (const file of files) {
    urls.push(await this.storageService.upload(file, ImageType.PORTFOLIO));
  }
    profile.portfolio_images = [...(profile.portfolio_images || []), ...urls];
    return this.profileRepo.save(profile);
  }

  // -------------------------
  // 9️⃣ Complete Profile (Both)
  // -------------------------
  async completeProfile(userId: string) {
    const profile = await this.getProfile(userId);

    if (
      !profile.owner_first_name ||
      (profile.user.role === Role.CONTRACTOR && !profile.categories?.length)
    ) {
      throw new BadRequestException('Profile incomplete');
    }

    profile.profile_step = 100;
    await this.profileRepo.save(profile);

    return { message: 'Business profile created successfully', status: 'completed' };
  }

  // -------------------------
  // 🔹 Delete Profile (Both)
  // -------------------------
  async deleteProfile(userId: string) {
    const profile = await this.getProfile(userId);
    return this.profileRepo.remove(profile);
  }

  // =========================
  // Helpers
  // =========================
  private async getProfile(userId: string): Promise<Profile> {
    const profile = await this.profileRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user', 'categories'],
    });
    if (!profile) throw new NotFoundException('Profile not found');
    return profile;
  }

  private ensureContractor(user: User) {
    if (user.role !== Role.CONTRACTOR) {
      throw new ForbiddenException('Only contractors can access this feature');
    }
  }

  private async uploadToS3(file: any): Promise<string> {
    return `https://cdn.yourapp.com/uploads/${Date.now()}-${file.originalname}`;
  }
}
