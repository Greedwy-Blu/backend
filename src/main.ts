import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { Logger } from '@nestjs/common';
import { FileMigrationProvider, Migration, Migrator } from 'kysely';
import * as path from 'path';
import { promises as fs } from 'fs'
import { db } from './config/database.config';
async function bootstrap() {


 // Banco de dados e migrações
 
 const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      // Corrija esta linha para apontar para a PASTA de migrações
      migrationFolder: path.join(__dirname, './migrations'),
    }),
  })

   const { error, results } = await migrator.migrateToLatest()

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`migration "${it.migrationName}" was executed successfully`)
    } else if (it.status === 'Error') {
      console.error(`failed to execute migration "${it.migrationName}"`)
    }
  })

  if (error) {
    console.error('failed to migrate')
    console.error(error)
    process.exit(1)
  }

  await db.destroy()

  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Configuração global de CORS para desenvolvimento
  app.enableCors({
    origin: [
      'http://localhost:8081', // React Native/Expo
      'http://localhost:3000', // Seu próprio backend
      'exp://localhost:19000', // Expo Go
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'X-Requested-With',
      'X-CSRF-Token',
    ],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // Configuração global de pipes (validação)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove propriedades não decoradas com @Decorator
      forbidNonWhitelisted: true, // Lança erro se propriedades não permitidas forem enviadas
      transform: true, // Transforma payloads para objetos DTO
      disableErrorMessages: process.env.NODE_ENV === 'production', // Desativa mensagens detalhadas em produção
    })
  );

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('NestJS API')
    .setDescription("API documentation for NestJS with Swagger, Orval, and Kysely")
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth' // Este nome deve corresponder ao usado no decorator @ApiBearerAuth()
    )
    .addTag('users')
    .addTag('auth')
    .addTag('orders')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Salva o arquivo swagger.json para uso com Orval
  writeFileSync('./swagger.json', JSON.stringify(document, null, 2));
  logger.log('Swagger JSON file generated at ./swagger.json');

  // Configuração dos endpoints do Swagger UI
  SwaggerModule.setup('api', app, document, {
    explorer: true,
    swaggerOptions: {
      filter: true,
      showRequestDuration: true,
      persistAuthorization: true, // Mantém o token JWT entre recargas
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  // Inicia o servidor
  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);
  logger.log(`Swagger UI available at: http://localhost:${port}/api`);
}

bootstrap();