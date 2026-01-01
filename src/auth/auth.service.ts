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
import * as nodemailer from 'nodemailer';

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
import { MailService } from 'src/mail/mail.service';
import { MoreThan } from 'typeorm';
import * as crypto from 'crypto';
function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
}


@Injectable()
export class AuthService {
  
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(TempAccount) private tempAccountRepo: Repository<TempAccount>,
    @InjectRepository(PasswordReset) private passwordResetRepo: Repository<PasswordReset>,
    @InjectRepository(Location) private locationRepo: Repository<Location>,
      private mailService: MailService,
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
//   async signupWithEmail(dto: SignupEmailDto) {
//     if (dto.password !== dto.confirm_password) {
//       throw new BadRequestException('Passwords do not match');
//     }

//     const existingUser = await this.userRepo.findOne({ where: { email: dto.email } });
//     if (existingUser) throw new BadRequestException('Email already exists');

//     const hashed = await bcrypt.hash(dto.password, 10);

//     const user = this.userRepo.create({
//       full_name: dto.full_name,
//       email: dto.email,
//       password: hashed,
//       role: dto.role,
//       is_verified: true,
//     });
// //  const data= ""
//     await this.userRepo.save(user);
//      // 🔴 IMPORTANT: password remove
//   const { password, ...safeUser } = user;

//     return { message: 'Account created successfully', user:safeUser };
//   }

async signupWithEmail(dto: SignupEmailDto) {
  const user = await this.userRepo.findOne({
  where: { email: dto.email },
});

if (user && user.status === 'active') {
  throw new BadRequestException('User already exists');
}

const otp = generateOtp();
  const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min

if (user && user.status === 'pending') {
  user.otp_code = otp;
  user.otp_expires_at = expiry;
  user.otp_last_sent_at = new Date();

  await this.userRepo.save(user);
} else {
  const newUser = this.userRepo.create({
    full_name: dto.full_name,
    email: dto.email,
    role: dto.role,
    status: 'pending',
    otp_code: otp,
    otp_expires_at: expiry,
  });
  await this.userRepo.save(newUser);
}
// 📧 Send OTP
  await this.mailService.sendOtpEmail(dto.email, otp);

  return {
    statusCode: 200,
    message: 'Verification email sent',
    next_step: 'verify_email_otp',
  };

  // const existingUser = await this.userRepo.findOne({
  //   where: { email: dto.email },
  // });

  // if (existingUser) {
  //   throw new BadRequestException('Email already exists');
  // }

  // const otp = Math.floor(10000 + Math.random() * 90000).toString();
  // const temp_token = 'temp_' + Date.now();

  // const tempAccount = this.tempAccountRepo.create({
  //   full_name: dto.full_name,
  //   email: dto.email,
  //   role: dto.role,
  //   otp,
  //   temp_token,
  //   is_verified: false,
  // });

  // await this.tempAccountRepo.save(tempAccount);

  // 📧 EMAIL VERIFICATION
  // await this.mailService.sendOtpEmail(dto.email, otp);

  // return {
  //   message: 'Verification email sent',
  //   temp_token,
  //   next_step: 'verify_email_otp',
  // };
}


  // ================= SIGNUP WITH PHONE (STEP 1) =================
 async signupWithPhone(dto: SignupPhoneDto) {
  const user = await this.userRepo.findOne({
    where: { phone_number: dto.phone_number },
  });

  // 🔴 Case 1: Already active
  if (user && user.status === 'active') {
    throw new BadRequestException('User already exists');
  }

  const otp = generateOtp();
  const expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  // 🟡 Case 2: Pending user → regenerate OTP
  if (user && user.status === 'pending') {
    user.otp_code = otp;
    user.otp_expires_at = expiry;
    await this.userRepo.save(user);
  } 
  // 🟢 Case 3: New user
  else {
    const newUser = this.userRepo.create({
      full_name: dto.full_name,
      phone_number: dto.phone_number,
      role: dto.role,
      status: 'pending',
      otp_code: otp,
      otp_expires_at: expiry,
    });

    await this.userRepo.save(newUser);
  }

  // 📲 SEND OTP (SMS service)
  // await this.smsService.sendOtp(dto.phone_number, otp);

  return {
    statusCode: 200,
    message: 'OTP sent successfully',
    next_step: 'verify_phone_otp',
  };
}


  // ================= VERIFY OTP (STEP 2) =================
  // async verifyOtp(dto: VerifyOtpDto) {
  //   const account = await this.tempAccountRepo.findOne({ where: { temp_token: dto.temp_token, role: dto.role } });
  //   if (!account || account.otp !== dto.otp) {
  //     throw new BadRequestException('Invalid OTP');
  //   }

  //   account.is_verified = true;
  //   await this.tempAccountRepo.save(account);

  //   return { message: 'OTP verified successfully', next_step: 'create_password' };
  // }
async verifyOtp(dto: VerifyOtpDto) {
  const user = await this.userRepo.findOne({
    where: [
      { email: dto.identifier },
      { phone_number: dto.identifier },
    ],
  });

  if (!user) {
    throw new BadRequestException('Invalid request');
  }

  if (user.status === 'active') {
    throw new BadRequestException('User already verified');
  }

  if (!user.otp_code || user.otp_code !== dto.otp) {
    throw new BadRequestException('Invalid OTP');
  }

  if (!user.otp_expires_at || user.otp_expires_at < new Date()) {
    throw new BadRequestException('OTP expired');
  }

  // ✅ VERIFY USER
  user.password_token = crypto.randomBytes(32).toString('hex'); // secure random token
  user.password_token_expires = new Date(Date.now() + 15 * 60 * 1000); // 15 min
  // user.status = 'active';
    // user.status = 'otp_verified';
  user.otp_code = null;
  user.otp_expires_at = null;

  await this.userRepo.save(user);

  return {
    message: 'OTP verified successfully',
    next_step: 'create_password',
    password_token: user.password_token, // return token to frontend
  };
}



  async resendOtp(dto: ResendOtpDto) {
  const user = await this.userRepo.findOne({
    where: [
      { email: dto.identifier },
      { phone_number: dto.identifier },
    ],
  });

  //  Security-safe response
  if (!user) {
    return { message: 'If the account exists, OTP has been sent' };
  }

  if (user.status === 'active') {
    throw new BadRequestException('User already verified');
  }

  // ⏱️ 60 sec cooldown
  if (user.otp_last_sent_at) {
    const secondsPassed =
      (Date.now() - user.otp_last_sent_at.getTime()) / 1000;

    if (secondsPassed < 60) {
      throw new BadRequestException(
        `Please wait ${Math.ceil(60 - secondsPassed)} seconds before resending OTP`,
      );
    }
  }

  // 🔢 Generate new OTP
  const otp = generateOtp();

  user.otp_code = otp;
  user.otp_expires_at = new Date(Date.now() + 5 * 60 * 1000); // 5 min
  user.otp_last_sent_at = new Date(); // ⏱️ reset timer

  await this.userRepo.save(user);

 // ✅ Send OTP email
  if (user.email) {
    await this.mailService.sendOtpEmail(user.email, otp);
  }


  return { message: 'OTP resent successfully' };
}



  // ================= CREATE PASSWORD (STEP 3) =================

  // async createPassword(dto: CreatePasswordDto) {
  //   if (dto.password !== dto.confirm_password) {
  //     throw new BadRequestException('Passwords do not match');
  //   }

  //   const tempAccount = await this.tempAccountRepo.findOne({ where: { temp_token: dto.temp_token, is_verified: true } });
  //   if (!tempAccount) throw new BadRequestException('Invalid or expired token');

  //   const hashed = await bcrypt.hash(dto.password, 10);

  //   const user = this.userRepo.create({
  //     full_name: tempAccount.full_name,
  //     phone_number: tempAccount.phone_number,
  //     password: hashed,
  //     role: tempAccount.role,
  //     is_verified: true,
  //   });

  //   await this.userRepo.save(user);

  //   await this.tempAccountRepo.remove(tempAccount); // remove temp after creating real user

  //   const token = this.jwtService.sign({ id: user.id, role: user.role });

  //   return { message: 'Account created successfully', access_token: token, user };
  // }


//   async createPassword(dto: CreatePasswordDto) {
//   if (dto.password !== dto.confirm_password) {
//     throw new BadRequestException('Passwords do not match');
//   }

//   // Find temp account by temp_token and verified
//   const tempAccount = await this.tempAccountRepo.findOne({
//     where: { temp_token: dto.temp_token, is_verified: true },
//   });

//   if (!tempAccount) {
//     throw new BadRequestException('Invalid or expired token');
//   }

//   const hashed = await bcrypt.hash(dto.password, 10);

//   // Create user for both email or phone signup
//   const user = this.userRepo.create({
//     full_name: tempAccount.full_name,
//     email: tempAccount.email ?? null,           // Email 
//     phone_number: tempAccount.phone_number ?? null, // Phone 
//     password: hashed,
//     role: tempAccount.role,
//     is_verified: true,
//   });

//   await this.userRepo.save(user);

//   // Remove temp account after creating real user
//   await this.tempAccountRepo.remove(tempAccount);

//   // JWT token generate
//   const token = this.jwtService.sign({ id: user.id, role: user.role });

//   // Return user without password
//   const { password, ...safeUser } = user;

//   return {
//     message: 'Account created successfully',
//     access_token: token,
//     user: safeUser,
//   };
// }

async createPassword(dto: CreatePasswordDto) {
  if (dto.password !== dto.confirm_password) {
    throw new BadRequestException('Passwords do not match');
  }

 const user = await this.userRepo.findOne({
  where: {
    password_token: dto.password_token,
    password_token_expires: MoreThan(new Date()), 
  },
});


  if (!user ) {
    throw new BadRequestException('Invalid or expired token');
  }
  const hashed = await bcrypt.hash(dto.password, 10);
  user.password = hashed;
  // ✅ Invalidate token immediately
  user.password_token = null;
  user.password_token_expires = null;
  user.status = 'active'; // fully verified now

  await this.userRepo.save(user);

  const token = this.jwtService.sign({
    id: user.id,
    role: user.role,
  });

  const { password, ...safeUser } = user;

  return {
    message: 'Account created successfully',
    access_token: token,
    user: safeUser,
  };
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
  // async forgotPassword(dto: ForgotPasswordDto) {
  //   const otp = Math.floor(10000 + Math.random() * 90000).toString();
  //   const reset_token = 'reset_' + Date.now();

  //   const record = this.passwordResetRepo.create({
  //     identifier: dto.identifier,
  //     otp,
  //     reset_token,
  //     role: dto.role,
  //     is_used: false,
  //   });

  //   await this.passwordResetRepo.save(record);

  //   return { message: 'Password reset OTP sent', reset_token };
  // }

  async forgotPassword(dto: ForgotPasswordDto) {
  // 1️⃣ Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // 2️⃣ Generate reset token
  const reset_token = crypto.randomBytes(32).toString('hex');

  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

  // 3️⃣ Invalidate old tokens
  await this.passwordResetRepo.update(
    { identifier: dto.identifier, is_used: false },
    { is_used: true }
  );

  // 4️⃣ Save new password reset record (OTP hashed)
  const record = this.passwordResetRepo.create({
    identifier: dto.identifier,
    otp: await bcrypt.hash(otp, 10),
    reset_token,
    role: dto.role,
    is_used: false,
    otp_expires_at: expiresAt,
  });

  await this.passwordResetRepo.save(record);

  // 5️⃣ Send OTP via Email (or SMS if phone)
  const user = await this.userRepo.findOne({ 
    where: [
      { email: dto.identifier },
      { phone_number: dto.identifier }
    ] 
  });

  if (!user) throw new BadRequestException('User not found');

  if (user.email) {
    // 🔹 Email transporter setup
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // 🔹 Email content
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: user.email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}. It will expire in 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);
  }

  if (user.phone_number) {
    // 🔹 Future: SMS logic here if user signed up with phone
    console.log(`Send OTP ${otp} to phone: ${user.phone_number}`);
  }

  return {
    message: 'Password reset OTP sent',
    reset_token,
    next_step: 'reset_password',
  };
}

//   async resetPassword(dto: ResetPasswordDto) {
//     if (dto.new_password !== dto.confirm_password) throw new BadRequestException('Passwords do not match');

//     const record = await this.passwordResetRepo.findOne({ where: { reset_token: dto.reset_token, otp: dto.otp, is_used: false } });
//     if (!record) throw new BadRequestException('Invalid reset token or OTP');

//     const hashed = await bcrypt.hash(dto.new_password, 10);

//     // Update user password

//     let user: User | null = null;
// if (record.role !== 'admin') {
//   user = await this.userRepo.findOne({
//     where: [
//       { email: record.identifier, role: record.role },
//       { phone_number: record.identifier, role: record.role },
//     ],
//   });
// }
//     if (!user && record.role !== 'admin') throw new BadRequestException('User not found');

//     if (user) {
//       user.password = hashed;
//       await this.userRepo.save(user);
//     }

//     record.is_used = true;
//     await this.passwordResetRepo.save(record);

//     return { message: 'Password reset successfully' };
//   }

  // ================= LOGOUT =================
  
async resetPassword(dto: ResetPasswordDto) {
  if (dto.new_password !== dto.confirm_password) {
    throw new BadRequestException('Passwords do not match');
  }

  // 🔍 Step 1: record find karo (OTP ke baghair)
  const record = await this.passwordResetRepo.findOne({
    where: {
      reset_token: dto.reset_token,
      is_used: false,
      otp_expires_at: MoreThan(new Date()),
    },
  });

  if (!record) {
    throw new BadRequestException('Invalid or expired reset token');
  }

  // 🔐 Step 2: OTP bcrypt compare
  const isOtpValid = await bcrypt.compare(dto.otp, record.otp);
  if (!isOtpValid) {
    throw new BadRequestException('Invalid OTP');
  }

  // 👤 Step 3: user find karo
  const user = await this.userRepo.findOne({
    where: [
      { email: record.identifier },
      { phone_number: record.identifier },
    ],
  });

  if (!user) {
    throw new BadRequestException('User not found');
  }

  //  Step 4: password update
  user.password = await bcrypt.hash(dto.new_password, 10);
  await this.userRepo.save(user);

  // 🔒 Step 5: token invalidate
  record.is_used = true;
  record.used_at = new Date();
  await this.passwordResetRepo.save(record);
  return { message: 'Password reset successfully' };
}


  // ================= LOGOUT =================
async logout(user: any) {
  // Stateless JWT logout →nothing deleted in backend
  // only remove token from frontside
  return {
    message: 'Logged out successfully',
    user_id: user?.id || null,
  };
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

    // ================= signup/login with google =================

  async googleLogin(googleUser: any) {
  let user = await this.userRepo.findOne({
    where: {
      provider: 'google',
      provider_id: googleUser.provider_id,
    },
  });

  // First time login → CREATE USER
  if (!user) {
    user = this.userRepo.create({
      full_name: googleUser.full_name,
      email: googleUser.email,
      provider: 'google',
      provider_id: googleUser.provider_id,
      status: 'active',
    });

    await this.userRepo.save(user);
  }

  const token = this.jwtService.sign({
    id: user.id,
    role: user.role,
  });

  const { password, ...safeUser } = user;

  return {
    message: 'Login successful',
    access_token: token,
    user: safeUser,
  };
}
// auth.service.ts
async oauthLogin(oauthUser: any) {
  let user = await this.userRepo.findOne({
    where: {
      provider: oauthUser.provider,
      provider_id: oauthUser.provider_id,
    },
  });

  // First time login → CREATE USER
  if (!user) {
    user = this.userRepo.create({
      full_name: oauthUser.full_name,
      email: oauthUser.email,
      provider: oauthUser.provider,     // google/facebook/apple
      provider_id: oauthUser.provider_id,
      status: 'active',
    });

    await this.userRepo.save(user);
  }

  const token = this.jwtService.sign({
    id: user.id,
    role: user.role,
  });

  const { password, ...safeUser } = user;

  return {
    message: 'Login successful',
    access_token: token,
    user: safeUser,
  };
}

}
