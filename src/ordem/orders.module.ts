import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Order } from './entities/order.entity';
import { OrderTracking } from './entities/order-tracking.entity';
import { Funcionario } from '../colaborador/entities/employee.entity';
import { Product } from '../produto/entities/produto.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Order, OrderTracking, Funcionario, Product])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}