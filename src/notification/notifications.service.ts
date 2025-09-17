import { Injectable, NotFoundException } from '@nestjs/common';
import { db } from '../config/database.config';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor() {}

  async sendNotification(recipientId: number, message: string, type: string): Promise<Notification> {
    const newNotification = await db.insertInto('notification')
      .values({
        userId: recipientId,
        message,
        read: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returningAll()
      .executeTakeFirstOrThrow();
    return {...newNotification, recipientId,type};
  }

  async getNotificationsByUserId(userId: number): Promise<Notification[]> {
    const rawLogs = await db.selectFrom('notification').selectAll().where('id', '=', userId).execute();
     
    const notifications: Notification[] = rawLogs.map(log => {
        return {
            ...log,
            recipientId: log.userId, 
            type: '' 
        };
    },);

    return  notifications }

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
    // Esta função pode ser usada para enviar alertas específicos relacionados a ordens.
    // Por exemplo, pode-se criar uma notificação para o gestor responsável pela ordem.
    // Por enquanto, apenas loga o alerta.
    console.log(`Alert for Order ${orderId}: ${message}`);
    // Poderíamos buscar o gestor da ordem e enviar uma notificação para ele aqui.
    // Exemplo: const order = await db.selectFrom('order').selectAll().where('id', '=', orderId).executeTakeFirst();
    // if (order) { this.sendNotification(order.gestorId, message, 'alert'); }
  }
}


