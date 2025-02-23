// src/entities/etapa.entity.ts
import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { Order } from './order.entity';
import { Funcionario } from '../../colaborador/entities/employee.entity';

@Entity()
export class Etapa {
  @PrimaryKey()
  id!: number;

  @Property()
  nome!: string; // Nome da etapa (ex.: corte, montagem, pintura)

  @ManyToOne(() => Order)
  order!: Order; // Pedido associado

  @ManyToOne(() => Funcionario)
  funcionario!: Funcionario; // Funcionário responsável

  @Property({ nullable: true })
  inicio?: Date; // Horário de início da etapa

  @Property({ nullable: true })
  fim?: Date; // Horário de término da etapa
}