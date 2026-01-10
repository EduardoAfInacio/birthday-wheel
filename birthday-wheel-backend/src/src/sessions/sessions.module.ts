import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { SessionsController } from './sessions.controller';
import { SessionsRepository } from './sessions.repository';
import { UsersService } from '../users/users.service';
import { QrtokenService } from '../qrtoken/qrtoken.service';
import { UsersRepository } from '../users/users.repository';
import { QrtokenRepository } from '../qrtoken/qrtoken.repository';
import { PrizesService } from '../prizes/prizes.service';
import { PrizesRepository } from '../prizes/prizes.repository';

@Module({
  controllers: [SessionsController],
  providers: [
    SessionsService,
    SessionsRepository,
    UsersService,
    UsersRepository,
    QrtokenService,
    QrtokenRepository,
    PrizesService,
    PrizesRepository,
  ],
  exports: [SessionsService],
})
export class SessionsModule {}
