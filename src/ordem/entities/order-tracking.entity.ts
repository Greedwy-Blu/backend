import { ApiProperty } from '@nestjs/swagger';

export class OrderTracking {
  @ApiProperty({ description: 'ID único do rastreamento', example: 1 })
  id!: number;

  // Foreign key to Order
  orderId!: number;

  // Foreign key to Funcionario
  funcionarioId!: number;

  @ApiProperty({ description: 'Hora de início do rastreamento', example: '2023-10-01T12:00:00Z' })
  startTime!: Date;

  @ApiProperty({ description: 'Hora de término do rastreamento', example: '2023-10-01T14:00:00Z', required: false })
  endTime?: Date;

  @ApiProperty({ description: 'Quantidade de peças perdidas', example: 5, required: false })
  lostQuantity?: number;

  @ApiProperty({ description: 'Quantidade de peças processadas', example: 100, required: false })
  processedQuantity?: number;
}


