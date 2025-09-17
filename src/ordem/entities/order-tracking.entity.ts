import { ApiProperty } from '@nestjs/swagger';

export interface OrderTracking {
  id: number;
  orderId: number;
  funcionarioId: number;
  startTime: Date;
  endTime: Date; 
  lostQuantity: number; 
  processedQuantity: number;
}


