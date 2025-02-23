// src/entities/order-tracking.entity.ts
import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { Order } from './order.entity';
import { Funcionario } from '../../colaborador/entities/employee.entity';

@Entity()
export class OrderTracking {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => Order)
  order!: Order;

  @ManyToOne(() => Funcionario)
  funcionarios!: Funcionario;

  @Property()
  startTime!: Date; // Hora de início

  @Property({ nullable: true })
  endTime?: Date; // Hora de término

  @Property({ nullable: true })
  lostQuantity?: number; // Peças perdidas

  @Property({ nullable: true })
  processedQuantity?: number; // Peças processadas
}