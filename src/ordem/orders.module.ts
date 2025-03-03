import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Order } from './entities/order.entity';
import { OrderTracking } from './entities/order-tracking.entity';
import { Funcionario } from '../colaborador/entities/funcionario.entity';
import { Product } from '../produto/entities/produto.entity';
import { Etapa } from './entities/etapa.entity';
import { MotivoInterrupcao } from './entities/motivo-interrupcao.entity';
import { HistoricoProducao } from './entities/historico-producao.entity';
import { AuthModule } from '../auth/auth.module'; // Importe o AuthModule corretamente

@Module({
  imports: [
    MikroOrmModule.forFeature([
      Order,
      OrderTracking,
      Funcionario,
      Product,
      Etapa,
      MotivoInterrupcao,
      HistoricoProducao,
    ]),
    AuthModule, // Importe o AuthModule aqui
  ],
  controllers: [OrdersController],
  providers: [OrdersService], // Remova o AuthService daqui
})
export class OrdersModule {}