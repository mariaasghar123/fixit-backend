import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { SubscriptionPlansModule } from './admin/subscription-plans/subscription-plans.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [ MailModule,
    // 🔹 ENV variables load
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 🔹 TypeORM via DATABASE_URL
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL, // ✅ MAIN FIX
      autoLoadEntities: true,
      synchronize: true, // ⚠️ dev only

      ssl: process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false,
    }),

    AuthModule,
    SubscriptionsModule,
    SubscriptionPlansModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
