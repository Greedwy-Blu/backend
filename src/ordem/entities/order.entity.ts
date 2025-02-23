// src/entities/order.entity.ts
// src/entities/order.entity.ts
import { Entity, PrimaryKey, Property, ManyToOne, OneToMany, Collection } from '@mikro-orm/core';
import { Product } from '../../produto/entities/produto.entity';
import { Funcionario } from '../../colaborador/entities/funcionario.entity';
import { OrderTracking } from './order-tracking.entity';
import { Etapa } from './etapa.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Order {
  @PrimaryKey()
  @ApiProperty({ description: 'ID único do pedido', example: 1 })
  id!: number;

  @Property()
  @ApiProperty({ description: 'Número da Ordem de Pedido (OP)', example: 'OP-12345' })
  orderNumber!: string;

  @Property()
  @ApiProperty({ description: 'Nome do pedido', example: 'Pedido de cortes especiais' })
  name!: string;

  @ManyToOne(() => Product)
  @ApiProperty({ description: 'Produto associado', type: () => Product })
  product!: Product;

  @ManyToOne(() => Funcionario)
  @ApiProperty({ description: 'Funcionário responsável', type: () => Funcionario })
  funcionarioResposavel!: Funcionario;

  @Property()
  @ApiProperty({ description: 'Quantidade de peças no lote', example: 100 })
  lotQuantity!: number;

  @Property()
  @ApiProperty({ description: 'Destino final do lote', example: 'Setor de Montagem' })
  finalDestination!: string;

  @OneToMany(() => OrderTracking, (tracking) => tracking.order)
  @ApiProperty({ description: 'Rastreamentos do pedido', type: () => [OrderTracking] })
  trackings = new Collection<OrderTracking>(this);

  @Property()
  @ApiProperty({ description: 'Status do pedido', example: 'aberto' })
  status: string = 'aberto';

  @OneToMany(() => Etapa, (etapa) => etapa.order)
  @ApiProperty({ description: 'Etapas do pedido', type: () => [Etapa] })
  etapas = new Collection<Etapa>(this);

  @Property()
  @ApiProperty({ description: 'Data de criação do pedido', example: '2023-10-01T12:00:00Z' })
  created_at: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  @ApiProperty({ description: 'Data de atualização do pedido', example: '2023-10-01T14:00:00Z' })
  updated_at: Date = new Date();
}