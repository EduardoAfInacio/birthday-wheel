import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app/app.module';

import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { DecimalToStringInterceptor } from './src/common/decimal-to-string.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new DecimalToStringInterceptor());
  app.enableCors({
    origin: '*',
    //   origin: [
    //   'http://localhost:4000',
    //   'https://frontend.amplifyapp.com',
    //   'https://www.mydomain.com'
    // ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Birthday Wheel')
    .setDescription('Birthday Wheel API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
