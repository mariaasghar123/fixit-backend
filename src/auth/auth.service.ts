import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { TempAccount } from './entities/temp-account.entity';
import { PasswordReset } from './entities/password-reset.entity';
import { Location } from './entities/location.entity';

import { AdminLoginDto } from './dto/admin-login.dto';
import { SignupEmailDto } from './dto/signup-email.dto';
import { SignupPhoneDto } from './dto/signup-phone.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ResendOtpDto } from './dto/resend-otp.dto';
import { CreatePasswordDto } from './dto/create-password.dto';
import { LoginEmailDto } from './dto/login-email.dto';
import { LoginPhoneDto } from './dto/login-phone.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { EnableLocationDto } from './dto/enable-location.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(TempAccount) private tempAccountRepo: Repository<TempAccount>,
    @InjectRepository(PasswordReset) private passwordResetRepo: Repository<PasswordReset>,
    @InjectRepository(Location) private locationRepo: Repository<Location>,
  ) {}

  // ================= ADMIN LOGIN =================
  async adminLogin(dto: AdminLoginDto) {
    const adminEmail = 'admin@example.com';
    const adminPassword = 'admin123';

    if (dto.email !== adminEmail || dto.password !== adminPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({ role: 'admin', email: adminEmail });
    return { access_token: token, role: 'admin' };
  }

  // ================= SIGNUP WITH EMAIL =================
  async signupWithEmail(dto: SignupEmailDto) {
    if (dto.password !== dto.confirm_password) {
      throw new BadRequestException('Passwords do not match');
    }

    const existingUser = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existingUser) throw new BadRequestException('Email already exists');

    const hashed = await bcrypt.hash(dto.password, 10);

    const user = this.userRepo.create({
      full_name: dto.full_name,
      email: dto.email,
      password: hashed,
      role: dto.role,
      is_verified: true,
    });

    await this.userRepo.save(user);

    return { message: 'Account created successfully', user };
  }

  // ================= SIGNUP WITH PHONE (STEP 1) =================
  async signupWithPhone(dto: SignupPhoneDto) {
    const temp_token = 'temp_' + Date.now();
    const otp = Math.floor(10000 + Math.random() * 90000).toString(); // 5-digit OTP

    const tempAccount = this.tempAccountRepo.create({
      full_name: dto.full_name,
      phone_number: dto.phone_number,
      role: dto.role,
      otp,
      temp_token,
      is_verified: false,
    });

    await this.tempAccountRepo.save(tempAccount);

    return { message: 'OTP sent successfully', temp_token, next_step: 'verify_otp' };
  }

  // ================= VERIFY OTP (STEP 2) =================
  async verifyOtp(dto: VerifyOtpDto) {
    const account = await this.tempAccountRepo.findOne({ where: { temp_token: dto.temp_token, role: dto.role } });
    if (!account || account.otp !== dto.otp) {
      throw new BadRequestException('Invalid OTP');
    }

    account.is_verified = true;
    await this.tempAccountRepo.save(account);

    return { message: 'OTP verified successfully', next_step: 'create_password' };
  }

  async resendOtp(dto: ResendOtpDto) {
    const account = await this.tempAccountRepo.findOne({ where: { temp_token: dto.temp_token, role: dto.role } });
    if (!account) throw new BadRequestException('Invalid or expired token');

    const otp = Math.floor(10000 + Math.random() * 90000).toString();
    account.otp = otp;
    await this.tempAccountRepo.save(account);

    return { message: 'OTP resent successfully' };
  }

  // ================= CREATE PASSWORD (STEP 3) =================
  
  async createPassword(dto: CreatePasswordDto) {
    if (dto.password !== dto.confirm_password) {
      throw new BadRequestException('Passwords do not match');
    }

    const tempAccount = await this.tempAccountRepo.findOne({ where: { temp_token: dto.temp_token, is_verified: true } });
    if (!tempAccount) throw new BadRequestException('Invalid or expired token');

    const hashed = await bcrypt.hash(dto.password, 10);

    const user = this.userRepo.create({
      full_name: tempAccount.full_name,
      phone_number: tempAccount.phone_number,
      password: hashed,
      role: tempAccount.role,
      is_verified: true,
    });

    await this.userRepo.save(user);

    await this.tempAccountRepo.remove(tempAccount); // remove temp after creating real user

    const token = this.jwtService.sign({ id: user.id, role: user.role });

    return { message: 'Account created successfully', access_token: token, user };
  }

  // ================= LOGIN =================
  async loginWithEmail(dto: LoginEmailDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email, role: dto.role } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({ id: user.id, role: user.role });
    return { access_token: token, user };
  }

  async loginWithPhone(dto: LoginPhoneDto) {
    const user = await this.userRepo.findOne({ where: { phone_number: dto.phone_number, role: dto.role } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(dto.password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({ id: user.id, role: user.role });
    return { access_token: token, user };
  }

  // ================= FORGOT / RESET PASSWORD =================
  async forgotPassword(dto: ForgotPasswordDto) {
    const otp = Math.floor(10000 + Math.random() * 90000).toString();
    const reset_token = 'reset_' + Date.now();

    const record = this.passwordResetRepo.create({
      identifier: dto.identifier,
      otp,
      reset_token,
      role: dto.role,
      is_used: false,
    });

    await this.passwordResetRepo.save(record);

    return { message: 'Password reset OTP sent', reset_token };
  }

  async resetPassword(dto: ResetPasswordDto) {
    if (dto.new_password !== dto.confirm_password) throw new BadRequestException('Passwords do not match');

    const record = await this.passwordResetRepo.findOne({ where: { reset_token: dto.reset_token, otp: dto.otp, is_used: false } });
    if (!record) throw new BadRequestException('Invalid reset token or OTP');

    const hashed = await bcrypt.hash(dto.new_password, 10);

    // Update user password

    let user: User | null = null;
if (record.role !== 'admin') {
  user = await this.userRepo.findOne({
    where: [
      { email: record.identifier, role: record.role },
      { phone_number: record.identifier, role: record.role },
    ],
  });
}
    if (!user && record.role !== 'admin') throw new BadRequestException('User not found');

    if (user) {
      user.password = hashed;
      await this.userRepo.save(user);
    }

    record.is_used = true;
    await this.passwordResetRepo.save(record);

    return { message: 'Password reset successfully' };
  }

  // ================= LOGOUT =================
  async logout() {
    // For stateless JWT, we just return success
    return { message: 'Logged out successfully' };
  }

  // ================= ENABLE / UPDATE LOCATION =================
  async enableLocation(user: any, dto: EnableLocationDto) {
    let location = await this.locationRepo.findOne({ where: { userId: user.id } });
    if (!location) {
      location = this.locationRepo.create({
        userId: user.id,
        latitude: dto.latitude,
        longitude: dto.longitude,
        enabled: dto.enabled,
      });
    } else {
      location.latitude = dto.latitude;
      location.longitude = dto.longitude;
      location.enabled = dto.enabled;
    }

    await this.locationRepo.save(location);

    return {
      message: dto.enabled ? 'Location access enabled' : 'Location access disabled',
      user_id: user.id,
      latitude: dto.latitude,
      longitude: dto.longitude,
      enabled: dto.enabled,
    };
  }
}
