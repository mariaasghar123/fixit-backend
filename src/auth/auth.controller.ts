import { Controller, Post, Body, UseGuards, Put, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AdminLoginDto } from './dto/admin-login.dto';
import { SignupEmailDto } from './dto/signup-email.dto';
import { SignupPhoneDto } from './dto/signup-phone.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { CreatePasswordDto } from './dto/create-password.dto';
import { LoginEmailDto } from './dto/login-email.dto';
import { LoginPhoneDto } from './dto/login-phone.dto';
import { EnableLocationDto } from './dto/enable-location.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ResendOtpDto } from './dto/resend-otp.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // ==================================================
  // ADMIN LOGIN
  // ==================================================
  @Post('admin-login')
  @ApiOperation({ summary: 'Admin login' })
  @ApiBody({ type: AdminLoginDto })
  @ApiResponse({
    status: 201,
    description: 'Admin successfully logged in',
    schema: {
      example: {
        access_token: 'jwt-token',
        role: 'admin',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  adminLogin(@Body() dto: AdminLoginDto) {
    return this.authService.adminLogin(dto);
  }

  // ==================================================
  // SIGNUP WITH EMAIL (USER / CONTRACTOR)
  // ==================================================
  @Post('signup/email')
  @ApiOperation({ summary: 'Signup with email (User / Contractor)' })
  @ApiBody({ type: SignupEmailDto })
  @ApiResponse({
  status: 201,
  description: 'Account created successfully',
  schema: {
    example: {
      message: 'Account created successfully',
      user: {
        id: 1,
        full_name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
        is_verified: true,
      },
    },
  },
})
  @ApiResponse({ status: 400, description: 'Email already exists / Validation error' })
  signupWithEmail(@Body() dto: SignupEmailDto) {
    return this.authService.signupWithEmail(dto);
  }

  // ==================================================
  // SIGNUP WITH PHONE (STEP 1)
  // ==================================================
  @Post('signup/phone')
  @ApiOperation({ summary: 'Signup with phone (send OTP)' })
  @ApiBody({ type: SignupPhoneDto })
  @ApiResponse({
  status: 200,
  description: 'OTP sent successfully',
  schema: {
    example: {
      message: 'OTP sent to registered email',
      temp_token: 'temp_xyz_123',
      next_step: 'verify_otp',
    },
  },
})
@ApiResponse({ status: 400, description: 'Invalid phone number' })
  signupWithPhone(@Body() dto: SignupPhoneDto) {
    return this.authService.signupWithPhone(dto);
  }

  // ==================================================
  // VERIFY OTP (STEP 2)
  // ==================================================
  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify OTP for phone signup' })
  @ApiBody({ type: VerifyOtpDto })
  @ApiResponse({
  status: 200,
  description: 'OTP verified successfully',
  schema: {
    example: {
      message: 'OTP verified',
      temp_token: 'temp_xyz_123',
      next_step: 'create_password',
    },
  },
})
@ApiResponse({ status: 401, description: 'Invalid OTP' })
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  @Post('resend-otp')
@ApiOperation({ summary: 'Resend OTP (User / Contractor)' })
@ApiBody({ type: ResendOtpDto })
@ApiResponse({
  status: 200,
  description: 'OTP resent successfully',
  schema: {
    example: {
      message: 'OTP resent successfully',
    },
  },
})
resendOtp(@Body() dto: ResendOtpDto) {
  return this.authService.resendOtp(dto);
}

  // ==================================================
  // CREATE PASSWORD (STEP 3)
  // ==================================================
  @Post('create-password')
  @ApiOperation({ summary: 'Create password after OTP verification' })
  @ApiBody({ type: CreatePasswordDto })
  @ApiResponse({
  status: 201,
  description: 'Account created successfully',
  schema: {
    example: {
      message: 'Account created successfully',
      access_token: 'jwt_token_here',
      user: {
        id: 2,
        full_name: 'Jane Doe',
        phone_number: '+1234567890',
        role: 'contractor',
        is_verified: true,
      },
    },
  },
})
@ApiResponse({ status: 400, description: 'Password mismatch / Invalid token' })
  createPassword(@Body() dto: CreatePasswordDto) {
    return this.authService.createPassword(dto);
  }

  // ========================================
// FORGOT PASSWORD
// ========================================
@Post('forgot-password')
@ApiOperation({ summary: 'Forgot password (Admin / User / Contractor)' })
@ApiBody({ type: ForgotPasswordDto })
@ApiResponse({
  status: 200,
  description: 'OTP sent successfully',
  schema: {
    example: {
      message: 'Password reset OTP sent',
      reset_token: 'reset_abc123',
    },
  },
})
forgotPassword(@Body() dto: ForgotPasswordDto) {
  return this.authService.forgotPassword(dto);
}

// ========================================
// RESET PASSWORD
// ========================================
@Post('reset-password')
@ApiOperation({ summary: 'Reset password using OTP' })
@ApiBody({ type: ResetPasswordDto })
@ApiResponse({
  status: 200,
  description: 'Password reset successful',
  schema: {
    example: {
      message: 'Password reset successfully',
    },
  },
})
resetPassword(@Body() dto: ResetPasswordDto) {
  return this.authService.resetPassword(dto);
}


  // ==================================================
  // LOGIN WITH EMAIL
  // ==================================================
  @Post('login/email')
  @ApiOperation({ summary: 'Login with email (User / Contractor)' })
  @ApiBody({ type: LoginEmailDto })
  @ApiResponse({
  status: 200,
  description: 'Login successful',
  schema: {
    example: {
      access_token: 'jwt_token_here',
      user: {
        id: 1,
        email: 'john@example.com',
        role: 'user',
      },
    },
  },
})
@ApiResponse({ status: 401, description: 'Invalid credentials' })
  loginWithEmail(@Body() dto: LoginEmailDto) {
    return this.authService.loginWithEmail(dto);
  }

  // ==================================================
  // LOGIN WITH PHONE
  // ==================================================
  @Post('login/phone')
  @ApiOperation({ summary: 'Login with phone number (User / Contractor)' })
  @ApiBody({ type: LoginPhoneDto })
  @ApiResponse({
  status: 200,
  description: 'Login successful',
  schema: {
    example: {
      access_token: 'jwt_token_here',
      user: {
        id: 2,
        phone_number: '+1234567890',
        role: 'contractor',
      },
    },
  },
})
@ApiResponse({ status: 401, description: 'Invalid credentials' })
  loginWithPhone(@Body() dto: LoginPhoneDto) {
    return this.authService.loginWithPhone(dto);
  }

  @Post('logout')
@ApiOperation({ summary: 'Logout (Admin / User / Contractor)' })
@ApiResponse({
  status: 200,
  description: 'Logout successful',
  schema: {
    example: { message: 'Logged out successfully' },
  },
})
logout() {
  return this.authService.logout();
}


@Post('enable-location')
@UseGuards(JwtAuthGuard)
@ApiOperation({ summary: 'Enable location access (User / Contractor)' })
@ApiBody({ type: EnableLocationDto })
@ApiResponse({
  status: 200,
  description: 'Location enabled successfully',
  schema: {
    example: {
      message: 'Location access enabled',
      latitude: 40.7128,
      longitude: -74.0060,
      enabled: true,
    },
  },
})
enableLocation(@Body() dto: EnableLocationDto, @Req() req) {
  return this.authService.enableLocation(req.user, dto);
}

@Put('enable-location')
@UseGuards(JwtAuthGuard)
@ApiOperation({ summary: 'Edit/update location access (User / Contractor)' })
@ApiBody({ type: EnableLocationDto })
@ApiResponse({
  status: 200,
  description: 'Location updated successfully',
  schema: {
    example: {
      message: 'Location access updated',
      latitude: 40.7128,
      longitude: -74.0060,
      enabled: true,
    },
  },
})
updateLocation(@Body() dto: EnableLocationDto, @Req() req) {
  return this.authService.enableLocation(req.user, dto);
}

}
