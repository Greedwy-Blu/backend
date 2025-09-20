// src/rabbitmq/rabbitmq.module.ts

import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // 👈 1. Import forwardRef
import { ScheduleModule } from '@nestjs/schedule';
import { RabbitMQService } from './rabbitmq.service';
import { NotificationProducer } from './notification.producer';
import { NotificationConsumer } from './notification.consumer';
import { ConnectionManagerService } from './connection-manager.service';
import { WebSocketModule } from '../websocket/websocket.module';
import { NotificationsModule } from '../notification/notifications.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    WebSocketModule, 
  
  ],
  providers: [
    {
      provide: ConnectionManagerService,
      useFactory: () => new ConnectionManagerService({
        url: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
      }),
    },
    RabbitMQService,
    NotificationProducer,
    NotificationConsumer,
  ],
  exports: [
    RabbitMQService,
    NotificationProducer,
    {
      provide: ConnectionManagerService,
      useFactory: () => new ConnectionManagerService({
        url: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
      }),
    },
  ],
})
export class RabbitMQModule {}