import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app/app.module';

import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { DecimalToStringInterceptor } from './src/common/decimal-to-string.interceptor';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new DecimalToStringInterceptor());
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
