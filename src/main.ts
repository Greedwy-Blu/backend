import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
  .setTitle('NestJS API')
  .setDescription('API documentation for NestJS with Swagger, Orval, and MikroORM')
  .setVersion('1.0')
  .addTag('users')
  .build();
  const document = SwaggerModule.createDocument(app, config);

  // Salva o arquivo swagger.json
  SwaggerModule.setup('swagger', app, document, {
    jsonDocumentUrl: 'swagger/json',
    yamlDocumentUrl: 'swagger/yaml',
  });
  writeFileSync('./swagger.json', JSON.stringify(document, null, 2));

  SwaggerModule.setup('api', app, document);
  
  app.useGlobalPipes(new ValidationPipe()); // Habilita a validação global
  await app.listen(3000);
}
bootstrap();