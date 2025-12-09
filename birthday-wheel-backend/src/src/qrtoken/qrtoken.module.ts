import { Module } from '@nestjs/common';
import { QrtokenService } from './qrtoken.service';
import { QrtokenController } from './qrtoken.controller';
import { QrtokenRepository } from './qrtoken.repository';

@Module({
  providers: [QrtokenService, QrtokenRepository],
  controllers: [QrtokenController],
})
export class QrtokenModule {}
