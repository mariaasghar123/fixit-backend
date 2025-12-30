// src/profile/profile.controller.ts
import {
  Controller,
  Post,
  Put,
  Delete,
  Body,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiBody,
  ApiResponse,
  ApiConsumes,
} from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ProfileService } from './profile.service';

import { CreateProfileBasicDto } from './dto/create-profile-basic.dto';
import { ProfileRadiusDto } from './dto/profile-radius.dto';
import { ProfileRateDto } from './dto/profile-rate.dto';
import { ProfileDescriptionDto } from './dto/profile-description.dto';
import { ProfileAvailabilityDto } from './dto/profile-availability.dto';
import { Profile } from './entities/profile.entity';

@ApiTags('Profile')
@ApiBearerAuth()
@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  // -------------------------
  // 1️⃣ Basic Info (Create & Update) - User + Contractor
  // -------------------------
  @Post('basic')
  @ApiOperation({ summary: 'Create basic profile info (Both: User & Contractor)' })
  @ApiBody({ type: CreateProfileBasicDto })
  @ApiResponse({ status: 200, description: 'Profile created successfully', type: Profile })
  createBasic(@Body() dto: CreateProfileBasicDto, @Req() req) {
    return this.profileService.createOrUpdateBasic(dto, req.user);
  }

  @Put('basic')
  @ApiOperation({ summary: 'Update basic profile info (Both: User & Contractor)' })
  @ApiBody({ type: CreateProfileBasicDto })
  @ApiResponse({ status: 200, description: 'Profile updated successfully', type: Profile })
  updateBasic(@Body() dto: CreateProfileBasicDto, @Req() req) {
    return this.profileService.createOrUpdateBasic(dto, req.user);
  }

  // -------------------------
  // 2️⃣ Work Radius (Contractor only)
  // -------------------------
  @Post('radius')
  @ApiOperation({ summary: 'Set work radius (Contractor only)' })
  @ApiBody({ type: ProfileRadiusDto })
  @ApiResponse({ status: 200, description: 'Work radius saved successfully', type: Profile })
  setRadius(@Body() dto: ProfileRadiusDto, @Req() req) {
    return this.profileService.setRadius(dto, req.user);
  }

  @Put('radius')
  @ApiOperation({ summary: 'Update work radius (Contractor only)' })
  @ApiBody({ type: ProfileRadiusDto })
  @ApiResponse({ status: 200, description: 'Work radius updated successfully', type: Profile })
  updateRadius(@Body() dto: ProfileRadiusDto, @Req() req) {
    return this.profileService.setRadius(dto, req.user);
  }

  // -------------------------
  // 3️⃣ Hourly Rate (Contractor only)
  // -------------------------
  @Post('rate')
  @ApiOperation({ summary: 'Set hourly rate (Contractor only)' })
  @ApiBody({ type: ProfileRateDto })
  @ApiResponse({ status: 200, description: 'Hourly rate saved successfully', type: Profile })
  setRate(@Body() dto: ProfileRateDto, @Req() req) {
    return this.profileService.setRate(dto, req.user);
  }

  @Put('rate')
  @ApiOperation({ summary: 'Update hourly rate (Contractor only)' })
  @ApiBody({ type: ProfileRateDto })
  @ApiResponse({ status: 200, description: 'Hourly rate updated successfully', type: Profile })
  updateRate(@Body() dto: ProfileRateDto, @Req() req) {
    return this.profileService.setRate(dto, req.user);
  }

  // -------------------------
  // 4️⃣ Description (Both)
  // -------------------------
  @Post('description')
  @ApiOperation({ summary: 'Set profile description (Both: User & Contractor)' })
  @ApiBody({ type: ProfileDescriptionDto })
  @ApiResponse({ status: 200, description: 'Description saved successfully', type: Profile })
  setDescription(@Body() dto: ProfileDescriptionDto, @Req() req) {
    return this.profileService.setDescription(dto, req.user);
  }

  @Put('description')
  @ApiOperation({ summary: 'Update profile description (Both: User & Contractor)' })
  @ApiBody({ type: ProfileDescriptionDto })
  @ApiResponse({ status: 200, description: 'Description updated successfully', type: Profile })
  updateDescription(@Body() dto: ProfileDescriptionDto, @Req() req) {
    return this.profileService.setDescription(dto, req.user);
  }

  // -------------------------
  // 5️⃣ Availability (Contractor only)
  // -------------------------
  @Post('availability')
  @ApiOperation({ summary: 'Set availability (Contractor only)' })
  @ApiBody({ type: ProfileAvailabilityDto })
  @ApiResponse({ status: 200, description: 'Availability saved successfully', type: Profile })
  setAvailability(@Body() dto: ProfileAvailabilityDto, @Req() req) {
    return this.profileService.setAvailability(dto, req.user);
  }

  @Put('availability')
  @ApiOperation({ summary: 'Update availability (Contractor only)' })
  @ApiBody({ type: ProfileAvailabilityDto })
  @ApiResponse({ status: 200, description: 'Availability updated successfully', type: Profile })
  updateAvailability(@Body() dto: ProfileAvailabilityDto, @Req() req) {
    return this.profileService.setAvailability(dto, req.user);
  }

  // -------------------------
  // 6️⃣ License (Contractor only)
  // -------------------------
  @Post('license')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
  @ApiOperation({ summary: 'Upload license (Contractor only)' })
  @ApiResponse({ status: 200, description: 'License uploaded successfully', type: Profile })
  uploadLicense(@UploadedFile() file: any, @Req() req) {
    return this.profileService.uploadLicense(file, req.user.id);
  }

  @Put('license')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
  @ApiOperation({ summary: 'Update license (Contractor only)' })
  @ApiResponse({ status: 200, description: 'License updated successfully', type: Profile })
  updateLicense(@UploadedFile() file: any, @Req() req) {
    return this.profileService.uploadLicense(file, req.user.id);
  }

  // -------------------------
  // 7️⃣ Profile Photo (Both)
  // -------------------------
  @Post('profile-photo')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
  @ApiOperation({ summary: 'Upload profile photo (Both)' })
  @ApiResponse({ status: 200, description: 'Profile photo uploaded successfully', type: Profile })
  uploadProfilePhoto(@UploadedFile() file: any, @Req() req) {
    return this.profileService.uploadProfilePhoto(file, req.user.id);
  }

  @Put('profile-photo')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } } })
  @ApiOperation({ summary: 'Update profile photo (Both)' })
  @ApiResponse({ status: 200, description: 'Profile photo updated successfully', type: Profile })
  updateProfilePhoto(@UploadedFile() file: any, @Req() req) {
    return this.profileService.uploadProfilePhoto(file, req.user.id);
  }

  // -------------------------
  // 8️⃣ Portfolio (Contractor only)
  // -------------------------
  @Post('portfolio')
  @UseInterceptors(FilesInterceptor('files', 10))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { files: { type: 'array', items: { type: 'string', format: 'binary' } } } } })
  @ApiOperation({ summary: 'Upload portfolio images (Contractor only)' })
  @ApiResponse({ status: 200, description: 'Portfolio uploaded successfully', type: Profile })
  uploadPortfolio(@UploadedFiles() files: any[], @Req() req) {
    return this.profileService.uploadPortfolio(files, req.user.id);
  }

  @Put('portfolio')
  @UseInterceptors(FilesInterceptor('files', 10))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ schema: { type: 'object', properties: { files: { type: 'array', items: { type: 'string', format: 'binary' } } } } })
  @ApiOperation({ summary: 'Update portfolio images (Contractor only)' })
  @ApiResponse({ status: 200, description: 'Portfolio updated successfully', type: Profile })
  updatePortfolio(@UploadedFiles() files: any[], @Req() req) {
    return this.profileService.uploadPortfolio(files, req.user.id);
  }

  // -------------------------
  // 9️⃣ Delete Profile (Both)
  // -------------------------
  @Delete()
  @ApiOperation({ summary: 'Delete user/contractor profile (Both)' })
  @ApiResponse({ status: 200, description: 'Profile deleted successfully' })
  deleteProfile(@Req() req) {
    return this.profileService.deleteProfile(req.user.id);
  }

  // -------------------------
  // 10️⃣ Complete Profile (Both)
  // -------------------------
  @Post('complete')
  @ApiOperation({ summary: 'Finalize profile (Both: User & Contractor)' })
  @ApiResponse({ status: 200, description: 'Profile finalized successfully' })
  completeProfile(@Req() req) {
    return this.profileService.completeProfile(req.user.id);
  }
}
