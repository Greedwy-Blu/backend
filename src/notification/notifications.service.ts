// src/notifications/notifications.service.ts

import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { Order } from '../ordem/entities/order.entity';
import { Injectable, NotFoundException } from '@nestjs/common'; // Adicione NotFoundException
@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: EntityRepository<Order>,
  ) {}

  async sendAlert(orderId: number, message: string): Promise<void> {
    const order = await this.orderRepository.findOne(orderId);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Lógica para enviar notificação (ex.: email, mensagem)
    console.log(`Alert for Order ${order.orderNumber}: ${message}`);
  }
}