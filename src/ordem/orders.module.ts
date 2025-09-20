import { forwardRef, Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { AuthModule } from '../auth/auth.module';
import { RabbitMQModule } from '../rabbitmq/rabbitmq.module';
import { NotificationsModule } from 'src/notification/notifications.module';

@Module({
  imports: [
    AuthModule,
    RabbitMQModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}


