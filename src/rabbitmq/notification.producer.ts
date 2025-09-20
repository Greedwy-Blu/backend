import { Injectable, Logger } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';

export interface NotificationMessage {
  id?: string;
  recipientId: number;
  message: string;
  type: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  metadata?: Record<string, any>;
  createdAt?: Date;
}

export interface OrderEventMessage {
  orderId: number;
  eventType: 'created' | 'started' | 'paused' | 'resumed' | 'completed' | 'cancelled' | 'interrupted';
  userId?: number;
  gestorId?: number;
  funcionarioId?: number;
  details?: Record<string, any>;
  timestamp?: Date;
}

export interface AlertMessage {
  orderId: number;
  alertType: 'delay' | 'quality_issue' | 'machine_failure' | 'resource_shortage' | 'custom';
  severity: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  recipientIds: number[];
  metadata?: Record<string, any>;
  timestamp?: Date;
}

@Injectable()
export class NotificationProducer {
  private readonly logger = new Logger(NotificationProducer.name);

  constructor(private readonly rabbitMQService: RabbitMQService) {}

  /**
   * Envia uma notificação para a fila de notificações
   */
  async sendNotification(notification: NotificationMessage): Promise<void> {
    try {
      const message = {
        ...notification,
        id: notification.id || this.generateId(),
        createdAt: notification.createdAt || new Date(),
        priority: notification.priority || 'normal',
      };

      
    } catch (error) {
      this.logger.error('Erro ao enviar notificação:', error);
      throw error;
    }
  }

  /**
   * Envia um evento de ordem para a fila de eventos
   */
  async sendOrderEvent(orderEvent: OrderEventMessage): Promise<void> {
    try {
      const message = {
        ...orderEvent,
        timestamp: orderEvent.timestamp || new Date(),
      };

      const routingKey = `order.${orderEvent.eventType}`;
      
    } catch (error) {
      this.logger.error('Erro ao enviar evento de ordem:', error);
      throw error;
    }
  }

  /**
   * Envia um alerta para a fila de alertas
   */
  async sendAlert(alert: AlertMessage): Promise<void> {
    try {
      const message = {
        ...alert,
        timestamp: alert.timestamp || new Date(),
      };


    } catch (error) {
      this.logger.error('Erro ao enviar alerta:', error);
      throw error;
    }
  }

  /**
   * Envia múltiplas notificações em lote
   */
  async sendBatchNotifications(notifications: NotificationMessage[]): Promise<void> {
    try {
      const promises = notifications.map(notification => this.sendNotification(notification));
      await Promise.all(promises);
      this.logger.log(`Lote de ${notifications.length} notificações enviado`);
    } catch (error) {
      this.logger.error('Erro ao enviar lote de notificações:', error);
      throw error;
    }
  }

  /**
   * Envia notificação com prioridade alta
   */
  async sendUrgentNotification(notification: Omit<NotificationMessage, 'priority'>): Promise<void> {
    await this.sendNotification({
      ...notification,
      priority: 'urgent',
    });
  }

  /**
   * Envia notificação para múltiplos destinatários
   */
  async sendBroadcastNotification(
    recipientIds: number[], 
    message: string, 
    type: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    const notifications = recipientIds.map(recipientId => ({
      recipientId,
      message,
      type,
      metadata,
    }));

    await this.sendBatchNotifications(notifications);
  }

  private generateId(): string {
    return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

