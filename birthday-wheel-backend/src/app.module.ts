import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './src/users/users.module';
import { PrismaModule } from './src/prisma/prisma.module';
import { QrtokenModule } from './src/qrtoken/qrtoken.module';
import { PrizesModule } from './src/prizes/prizes.module';
import { SessionsModule } from './src/sessions/sessions.module';

@Module({
  imports: [UsersModule, PrismaModule, QrtokenModule, PrizesModule, SessionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
