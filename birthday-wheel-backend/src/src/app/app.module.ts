import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../users/users.module';
import { PrismaModule } from '../prisma/prisma.module';
import { QrtokenModule } from '../qrtoken/qrtoken.module';
import { PrizesModule } from '../prizes/prizes.module';
import { SessionsModule } from '../sessions/sessions.module';
import { UsersService } from '../users/users.service';
import { PrizesService } from '../prizes/prizes.service';
import { QrtokenService } from '../qrtoken/qrtoken.service';
import { SessionsService } from '../sessions/sessions.service';
import { UsersRepository } from '../users/users.repository';
import { PrizesRepository } from '../prizes/prizes.repository';
import { QrtokenRepository } from '../qrtoken/qrtoken.repository';
import { SessionsRepository } from '../sessions/sessions.repository';
import { AuthModule } from '../auth/auth.module';
import { AuthRepository } from '../auth/auth.repository';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [
    UsersModule,
    PrismaModule,
    QrtokenModule,
    PrizesModule,
    SessionsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
