// src/entities/order.entity.ts
import { Entity, PrimaryKey, Property, ManyToOne, OneToMany, Collection } from '@mikro-orm/core';
import { Product } from '../../produto/entities/produto.entity';
import { Funcionario } from '../../colaborador/entities/employee.entity';
import { OrderTracking } from './order-tracking.entity';
import { Etapa } from './etapa.entity';

@Entity()
export class Order {
  @PrimaryKey()
  id!: number;

  @Property()
  orderNumber!: string; // Número da Ordem de Pedido (OP)

  @ManyToOne(() => Product)
  product!: Product; // Produto associado

  @ManyToOne(() => Funcionario)
  funcionarioResposavel!: Funcionario; // Funcionário responsável

  @Property()
  lotQuantity!: number; // Quantidade de peças no lote

  @Property()
  finalDestination!: string; // Destino final do lote

  @OneToMany(() => OrderTracking, (tracking) => tracking.order)
  trackings = new Collection<OrderTracking>(this); // Rastreamentos do pedido
  
  @Property()
  status: string = 'aberto';

  @OneToMany(() => Etapa, (etapa) => etapa.order)
  etapas = new Collection<Etapa>(this); // Etapas do pedido
  
  @Property()
  created_at: Date = new Date(); // Data de criação do pedido

  @Property({ onUpdate: () => new Date() })
  updated_at: Date = new Date(); // Data de atualização do pedido
}
