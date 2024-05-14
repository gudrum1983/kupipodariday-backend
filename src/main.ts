import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // Добавим глобальный пайплайн валидации на следующей строке
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      //skipMissingProperties: true
    }),
  );

  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('КупиПодариДай')
    .setDescription('КупиПодариДай API описание')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3001);
}
bootstrap();
