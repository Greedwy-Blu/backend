import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConnectionManagerService } from './connection-manager.service';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService {
  private readonly logger = new Logger(RabbitMQService.name);
  
  // Configurações das filas
  public readonly QUEUES = {
    NOTIFICATIONS: 'notifications_queue',
    ORDER_EVENTS: 'order_events_queue',
    ALERTS: 'alerts_queue',
    // Dead Letter Queues
    NOTIFICATIONS_DLQ: 'notifications_dlq',
    ORDER_EVENTS_DLQ: 'order_events_dlq',
    ALERTS_DLQ: 'alerts_dlq',
  };

  public readonly EXCHANGES = {
    NOTIFICATIONS: 'notifications_exchange',
    ORDER_EVENTS: 'order_events_exchange',
    // Dead Letter Exchanges
    NOTIFICATIONS_DLX: 'notifications_dlx',
    ORDER_EVENTS_DLX: 'order_events_dlx',
  };

  constructor(private readonly connectionManager: ConnectionManagerService) {}

 
  




  getChannel(): amqp.Channel | null {
    return this.connectionManager.getChannel();
  }

  getConnection(): amqp.Connection | null {
    return this.connectionManager.getConnection();
  }

  isConnected(): boolean {
    return this.connectionManager.isConnected();
  }

}

