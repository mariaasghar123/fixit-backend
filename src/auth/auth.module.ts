import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { PasswordReset } from './entities/password-reset.entity';
import { Location } from './entities/location.entity';
import { TempAccount } from './entities/temp-account.entity';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
  imports: [
    TypeOrmModule.forFeature([User, TempAccount, PasswordReset, Location]), // add all entities
    JwtModule.register({
      secret: 'YOUR_SECRET_KEY', // 🔹 change to env variable later
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
