import { Module } from '@nestjs/common';
import { PrizesService } from './prizes.service';
import { PrizesController } from './prizes.controller';
import { PrizesRepository } from './prizes.repository';

@Module({
  controllers: [PrizesController],
  providers: [PrizesService, PrizesRepository],
})
export class PrizesModule {}
