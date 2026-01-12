import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../users/users.module';
import { PrismaModule } from '../prisma/prisma.module';
import { QrtokenModule } from '../qrtoken/qrtoken.module';
import { PrizesModule } from '../prizes/prizes.module';
import { SessionsModule } from '../sessions/sessions.module';
import { AuthModule } from '../auth/auth.module';
import { BullModule } from '@nestjs/bull';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailConsumer } from '../email/email.consumer';

@Module({
  imports: [
    UsersModule,
    PrismaModule,
    QrtokenModule,
    PrizesModule,
    SessionsModule,
    AuthModule,
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD || '123',
      },
    }),
    BullModule.registerQueue({
      name: 'email-queue',
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST || 'localhost',
        port: Number(process.env.MAIL_PORT) || 1025,
        secure: false,
        ignoreTLS: true,
        ...(process.env.MAIL_USER
          ? {
              auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
              },
            }
          : {}),
      },
      defaults: {
        from: {
          name: 'Birthday wheel',
          address: process.env.MAIL_FROM || 'noreply@birthdaywheel.com',
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, EmailConsumer],
})
export class AppModule {}
