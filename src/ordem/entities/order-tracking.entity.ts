// src/entities/order-tracking.entity.ts
import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { Order } from './order.entity';
import { Funcionario } from '../../colaborador/entities/funcionario.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class OrderTracking {
  @PrimaryKey()
  @ApiProperty({ description: 'ID único do rastreamento', example: 1 })
  id!: number;

  @ManyToOne(() => Order)
  @ApiProperty({ description: 'Pedido associado', type: () => Order })
  order!: Order;

  @ManyToOne(() => Funcionario)
  @ApiProperty({ description: 'Funcionário responsável', type: () => Funcionario })
  funcionarios!: Funcionario;

  @Property()
  @ApiProperty({ description: 'Hora de início do rastreamento', example: '2023-10-01T12:00:00Z' })
  startTime!: Date; // Hora de início

  @Property({ nullable: true })
  @ApiProperty({ description: 'Hora de término do rastreamento', example: '2023-10-01T14:00:00Z', required: false })
  endTime?: Date; // Hora de término

  @Property({ nullable: true })
  @ApiProperty({ description: 'Quantidade de peças perdidas', example: 5, required: false })
  lostQuantity?: number; // Peças perdidas

  @Property({ nullable: true })
  @ApiProperty({ description: 'Quantidade de peças processadas', example: 100, required: false })
  processedQuantity?: number; // Peças processadas
}