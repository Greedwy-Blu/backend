// src/entities/etapa.entity.ts
import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { Order } from './order.entity';
import { Funcionario } from '../../colaborador/entities/funcionario.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Etapa {
  @PrimaryKey()
  @ApiProperty({ description: 'ID único da etapa', example: 1 })
  id!: number;

  @Property()
  @ApiProperty({ description: 'Nome da etapa', example: 'Corte' })
  nome!: string;

  @ManyToOne(() => Order)
  @ApiProperty({ description: 'Pedido associado', type: () => Order })
  order!: Order;

  @ManyToOne(() => Funcionario)
  @ApiProperty({ description: 'Funcionário responsável', type: () => Funcionario })
  funcionario!: Funcionario;

  @Property({ nullable: true })
  @ApiProperty({ description: 'Horário de início da etapa', example: '2023-10-01T12:00:00Z', required: false })
  inicio?: Date;

  @Property({ nullable: true })
  @ApiProperty({ description: 'Horário de término da etapa', example: '2023-10-01T14:00:00Z', required: false })
  fim?: Date;

  // Método para iniciar a etapa
  iniciarEtapa() {
    this.inicio = new Date();
  }

  // Método para finalizar a etapa
  finalizarEtapa() {
    this.fim = new Date();
  }
}