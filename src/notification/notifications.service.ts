import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../config/database.config';
import { Notification } from './entities/notification.entity';
import { NotificationProducer } from '../rabbitmq/notification.producer';

@Injectable()
export class NotificationsService {
  constructor(private readonly notificationProducer: NotificationProducer) {}

  async sendNotification(recipientId: number, message: string, type: string): Promise<Notification> {
    // Envia a notificação para a fila RabbitMQ em vez de inserir diretamente no banco
    await this.notificationProducer.sendNotification({
      recipientId,
      message,
      type,
    });

    // Retorna uma notificação temporária para manter compatibilidade com a API
    // A notificação real será criada pelo consumidor
    return {
      id: 0, // ID temporário
      message,
      read: false,
      createdAt: new Date(),
    
      recipientId,
      type,
    };
  }

 // Em notifications.service.ts
async getNotificationsByUserId(userId: number): Promise<Notification[]> {
  // Assume que a coluna na tabela 'notification' que guarda o ID do usuário é 'userId'
  const rawLogs = await db.selectFrom('notification')
    .selectAll()
    .where('userId', '=', userId) // <-- CORRIGIDO!
    .orderBy('createdAt', 'desc') // Boa prática: ordenar as notificações
    .execute();
   
  const notifications: Notification[] = rawLogs.map(log => {
      return {
          ...log,
          recipientId: log.userId, 
          type: '', // Defina um valor padrão ou ajuste conforme necessário
      };
  });

  return notifications;
}

  async markAsRead(notificationId: number): Promise<Notification> {
    const notification = await db.selectFrom('notification').selectAll().where('id', '=', notificationId).executeTakeFirst();
    if (!notification) {
      throw new NotFoundException(`Notification with ID ${notificationId} not found.`);
    }

    const updatedNotification = await db.updateTable('notification')
      .set({ read: true })
      .where('id', '=', notificationId)
      .returningAll()
      .executeTakeFirstOrThrow();
    return {
      ...updatedNotification,
      recipientId: updatedNotification.userId,
      type: '', // Set the appropriate type if available
    };
  }

  async sendAlert(orderId: number, message: string): Promise<void> {
    // Busca informações da ordem para determinar os destinatários
    const order = await db.selectFrom('order').selectAll().where('id', '=', orderId).executeTakeFirst();
    
    if (order) {
      const recipientIds: number[] = [];
      
      // Adiciona o funcionário responsável
      if (order.funcionarioResposavelId) {
        recipientIds.push(order.funcionarioResposavelId);
      }

      // Busca gestores do setor (se aplicável)
      // Aqui você pode adicionar lógica para buscar gestores relacionados

      // Envia o alerta via RabbitMQ
      await this.notificationProducer.sendAlert({
        orderId,
        alertType: 'custom',
        severity: 'warning',
        message,
        recipientIds,
        metadata: {
          orderNumber: order.orderNumber,
          productId: order.productId,
        },
      });
    } else {
      console.log(`Alert for Order ${orderId}: ${message} - Ordem não encontrada`);
    }
  }
}


