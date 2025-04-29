// src/maquina/entities/maquina.entity.ts
import { Entity, PrimaryKey, Property, OneToMany, Collection } from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';
import { Order } from '../../ordem/entities/order.entity';

@Entity()
export class Maquina {
  @PrimaryKey()
  @ApiProperty({ description: 'ID único da máquina', example: 1 })
  id!: number;

  @Property()
  @ApiProperty({ description: 'Código da máquina', example: 'MAQ-001' })
  codigo!: string;

  @Property()
  @ApiProperty({ description: 'Nome da máquina', example: 'Torno CNC' })
  nome!: string;

  @Property()
  @ApiProperty({ description: 'Tipo da máquina', example: 'Torno' })
  tipo!: string;

  @Property()
  @ApiProperty({ description: 'Modelo da máquina', example: 'CNC-5000' })
  modelo!: string;

  @Property()
  @ApiProperty({ description: 'Fabricante da máquina', example: 'Romi' })
  fabricante!: string;

  @Property({ nullable: true })
  @ApiProperty({ description: 'Capacidade da máquina', example: '500kg', required: false })
  capacidade?: string;

  @Property()
  @ApiProperty({ description: 'Status da máquina', example: 'ativa' })
  status: string = 'ativa';

  @OneToMany(() => Order, (order) => order.maquina)
  @ApiProperty({ description: 'Ordens de serviço associadas à máquina', type: () => [Order] })
  ordens = new Collection<Order>(this);

  @Property()
  @ApiProperty({ description: 'Data de criação do registro', example: '2023-10-01T12:00:00Z' })
  created_at: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  @ApiProperty({ description: 'Data de atualização do registro', example: '2023-10-01T14:00:00Z' })
  updated_at: Date = new Date();
}
