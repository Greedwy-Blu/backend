import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
  .setTitle('NestJS API')
  .setDescription('API documentation for NestJS with Swagger, Orval, and MikroORM')
  .setVersion('1.0')
  .addTag('users')
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

   
  app.useGlobalPipes(new ValidationPipe()); // Habilita a validação global
  await app.listen(3000);
}
bootstrap();