import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';
import { NotificationMessage, OrderEventMessage, AlertMessage } from './notification.producer';
import { NotificationGateway } from '../websocket/websocket.gateway';
import { db } from '../config/database.config';

@Injectable()
export class NotificationConsumer{
  private readonly logger = new Logger(NotificationConsumer.name);

  constructor(
    private readonly rabbitMQService: RabbitMQService,
    private readonly notificationGateway: NotificationGateway
  ) {}

 

  

  /**
   * Processa uma notificação da fila
   */
  private async processNotification(message: NotificationMessage): Promise<void> {
    try {
      this.logger.log(`Processando notificação: ${message.id} para usuário ${message.recipientId}`);

      // Salva a notificação no banco de dados
      const savedNotification = await db.insertInto('notification')
        .values({
          userId: message.recipientId,
          message: message.message,
          read: false,
          createdAt: message.createdAt || new Date(),
          updatedAt: new Date(),
        })
        .returningAll()
        .executeTakeFirstOrThrow();

      this.logger.log(`Notificação ${message.id} salva no banco com ID ${savedNotification.id}`);

      // Aqui você pode adicionar lógica adicional, como:
      // - Enviar notificação push
      // - Enviar email
      // - Enviar via WebSocket para usuários online
      await this.sendRealTimeNotification(message);

    } catch (error) {
      this.logger.error('Erro ao processar notificação:', error);
      throw error;
    }
  }

  /**
   * Processa um evento de ordem da fila
   */
  private async processOrderEvent(message: OrderEventMessage): Promise<void> {
    try {
      this.logger.log(`Processando evento de ordem: ${message.eventType} para ordem ${message.orderId}`);

      // Busca informações da ordem
      const order = await db.selectFrom('order')
        .selectAll()
        .where('id', '=', message.orderId)
        .executeTakeFirst();

      if (!order) {
        this.logger.warn(`Ordem ${message.orderId} não encontrada`);
        return;
      }

      // Gera notificações baseadas no evento
      await this.generateNotificationsFromOrderEvent(message, order);

      // Registra o evento no histórico se necessário
      if (message.funcionarioId) {
        await this.logOrderEvent(message, order);
      }

    } catch (error) {
      this.logger.error('Erro ao processar evento de ordem:', error);
      throw error;
    }
  }

  /**
   * Processa um alerta da fila
   */
  private async processAlert(message: AlertMessage): Promise<void> {
    try {
      this.logger.log(`Processando alerta: ${message.alertType} para ordem ${message.orderId}`);

      // Envia notificações para todos os destinatários do alerta
      for (const recipientId of message.recipientIds) {
        const notification: NotificationMessage = {
          recipientId,
          message: `🚨 ALERTA: ${message.message}`,
          type: 'alert',
          priority: this.mapSeverityToPriority(message.severity),
          metadata: {
            orderId: message.orderId,
            alertType: message.alertType,
            severity: message.severity,
            ...message.metadata,
          },
        };

        await this.processNotification(notification);
      }

    } catch (error) {
      this.logger.error('Erro ao processar alerta:', error);
      throw error;
    }
  }

  /**
   * Gera notificações baseadas em eventos de ordem
   */
  private async generateNotificationsFromOrderEvent(
    event: OrderEventMessage, 
    order: any
  ): Promise<void> {
    const notifications: NotificationMessage[] = [];

    switch (event.eventType) {
      case 'created':
        if (order.funcionarioResposavelId) {
          notifications.push({
            recipientId: order.funcionarioResposavelId,
            message: `Nova ordem de produção criada: ${order.orderNumber}`,
            type: 'order_created',
            metadata: { orderId: order.id, orderNumber: order.orderNumber },
          });
        }
        break;

      case 'started':
        if (order.funcionarioResposavelId) {
          notifications.push({
            recipientId: order.funcionarioResposavelId,
            message: `Ordem ${order.orderNumber} foi iniciada`,
            type: 'order_started',
            metadata: { orderId: order.id, orderNumber: order.orderNumber },
          });
        }
        break;

      case 'completed':
        if (order.funcionarioResposavelId) {
          notifications.push({
            recipientId: order.funcionarioResposavelId,
            message: `Ordem ${order.orderNumber} foi finalizada com sucesso`,
            type: 'order_completed',
            metadata: { orderId: order.id, orderNumber: order.orderNumber },
          });
        }
        break;

      case 'interrupted':
        if (order.funcionarioResposavelId) {
          notifications.push({
            recipientId: order.funcionarioResposavelId,
            message: `Ordem ${order.orderNumber} foi interrompida`,
            type: 'order_interrupted',
            priority: 'high',
            metadata: { orderId: order.id, orderNumber: order.orderNumber },
          });
        }
        break;
    }

    // Processa todas as notificações geradas
    for (const notification of notifications) {
      await this.processNotification(notification);
    }
  }

  /**
   * Registra o evento no histórico de produção
   */
  private async logOrderEvent(event: OrderEventMessage, order: any): Promise<void> {
    try {
      const actionMap = {
        created: 'Ordem criada',
        started: 'Produção iniciada',
        paused: 'Produção pausada',
        resumed: 'Produção retomada',
        completed: 'Produção finalizada',
        cancelled: 'Ordem cancelada',
        interrupted: 'Produção interrompida',
      };

      await db.insertInto('historico_producao')
        .values({
          orderId: order.id,
          funcionarioId: event.funcionarioId!,
          acao: actionMap[event.eventType] || event.eventType,
          detalhes: JSON.stringify(event.details || {}),
          data_hora: event.timestamp || new Date(),
        })
        .execute();

    } catch (error) {
      this.logger.error('Erro ao registrar evento no histórico:', error);
    }
  }

  /**
   * Envia notificação em tempo real (WebSocket, etc.)
   */
  private async sendRealTimeNotification(notification: NotificationMessage): Promise<void> {
    try {
      // Envia via WebSocket se o usuário estiver conectado
      if (this.notificationGateway.isUserConnected(notification.recipientId)) {
        this.notificationGateway.sendNotificationToUser(notification.recipientId, {
          id: notification.id,
          message: notification.message,
          type: notification.type,
          priority: notification.priority,
          metadata: notification.metadata,
          createdAt: notification.createdAt,
        });
      }

      // Aqui você pode adicionar outras formas de notificação em tempo real:
      // - Push notifications para dispositivos móveis
      // - Emails para notificações importantes
      // - SMS para alertas críticos
      
      this.logger.log(`Notificação em tempo real processada para usuário ${notification.recipientId}`);

    } catch (error) {
      this.logger.error('Erro ao enviar notificação em tempo real:', error);
    }
  }

  /**
   * Mapeia severidade do alerta para prioridade da notificação
   */
  private mapSeverityToPriority(severity: string): 'low' | 'normal' | 'high' | 'urgent' {
    const severityMap = {
      info: 'low' as const,
      warning: 'normal' as const,
      error: 'high' as const,
      critical: 'urgent' as const,
    };

    return severityMap[severity] || 'normal';
  }
}

