import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { PasswordReset } from './entities/password-reset.entity';
import { Location } from './entities/location.entity';
import { TempAccount } from './entities/temp-account.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from 'src/mail/mail.module';
import { GoogleStrategy } from './strategies/google.strategy';
import { FacebookStrategy } from './strategies/facebook.strategy';
import { AppleStrategy } from './strategies/apple.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, TempAccount, PasswordReset, Location]), // add all entities
    JwtModule.register({
      secret: process.env.JWT_SECRET, // 🔹 change to env
      signOptions: { expiresIn: '1h' },

    }),
    MailModule
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, FacebookStrategy],
})
export class AuthModule {}
