import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql'; // Importe o driver do PostgreSQL
import { AppController } from './app.controller';
import { AppService } from './app.service';
import config from './config/mikro-orm.config'; // Importe a configuração do MikroORM

// Importe os módulos personalizados
import { OrdersModule } from './ordem/orders.module';
import { FuncionarioModule } from './colaborador/funcionario.module';
import { GestaoModule } from './gestor/gestor.module';
import { ProductsModule } from './produto/produto.module';
import { SectorsModule } from './sector/sector.module';
import { AuthModule } from './auth/auth.module';

import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // Configuração do MikroORM com o PostgreSQL
    MikroOrmModule.forRoot({
      ...config, // Use a configuração importada
      driver: PostgreSqlDriver, // Especifique o driver do PostgreSQL
    }),

    // Importe os módulos personalizados
    OrdersModule, // Módulo de ordens
    FuncionarioModule, // Módulo de funcionários
    GestaoModule, // Módulo de gestão
    ProductsModule, // Módulo de produtos
    SectorsModule, // Módulo de setores
    AuthModule, // Módulo de autenticação
  ],
  controllers: [AppController], // Controladores globais
  providers: [AppService], // Serviços globais
})
export class AppModule {}