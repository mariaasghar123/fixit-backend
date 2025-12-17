import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [AuthModule,TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'fixit_user',
      password: 'fixit@123',
      database: 'fixit_db',
      autoLoadEntities: true,
      synchronize: true, // ⚠️ dev only
    }),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
