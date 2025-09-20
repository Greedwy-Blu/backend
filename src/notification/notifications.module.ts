import { forwardRef, Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { RabbitMQModule } from '../rabbitmq/rabbitmq.module';
import { OrdersModule } from 'src/ordem/orders.module';

@Module({
  imports: [forwardRef(() => OrdersModule)], // 👈 Wrap the module
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}


