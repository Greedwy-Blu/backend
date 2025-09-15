import { Injectable } from '@nestjs/common';
import { OrdersService } from '../ordem/orders.service';

@Injectable()
export class ReportsService {
  constructor(private readonly ordersService: OrdersService) {}

  async generateOrderReport(orderId: number) {
    return this.ordersService.getOrderReport(orderId);
  }
}


