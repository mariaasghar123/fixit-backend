import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';

@Module({
  providers: [StorageService],
  exports: [StorageService], // 🔥 VERY IMPORTANT
})
export class StorageModule {}
