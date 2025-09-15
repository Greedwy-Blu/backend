import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Importe os módulos personalizados
import { OrdersModule } from './ordem/orders.module';
import { FuncionarioModule } from './colaborador/funcionario.module';
import { GestaoModule } from './gestor/gestor.module';
import { ProductsModule } from './produto/produto.module';
import { SectorsModule } from './sector/sector.module';
import { AuthModule } from './auth/auth.module';
import { MaquinaModule } from './maquina/maquina.module';
import { ReportsModule } from './reports/reports.module';
import { AuditModule } from './audit/audit.module';
import { NotificationsModule } from './notification/notifications.module';
import { BackupModule } from './backup/backup.module';

import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // Não há necessidade de importar MikroOrmModule aqui, pois Kysely é usado diretamente nos serviços

    // Importe os módulos personalizados
    OrdersModule,
    FuncionarioModule,
    GestaoModule,
    ProductsModule,
    SectorsModule,
    AuthModule,
    MaquinaModule,
    ReportsModule,
    AuditModule,
    NotificationsModule,
    BackupModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


