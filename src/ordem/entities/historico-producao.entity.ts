// src/entities/historico-producao.entity.ts
import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { Order } from './order.entity';
import { Funcionario } from '../../colaborador/entities/funcionario.entity';
import { MotivoInterrupcao } from './motivo-interrupcao.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class HistoricoProducao {
  @PrimaryKey()
  @ApiProperty({ description: 'ID único do histórico', example: 1 })
  id!: number;

  @ManyToOne(() => Order)
  @ApiProperty({ description: 'Pedido associado', type: () => Order })
  pedido!: Order;

  @ManyToOne(() => Funcionario)
  @ApiProperty({ description: 'Funcionário responsável', type: () => Funcionario })
  funcionario!: Funcionario;

  @Property()
  @ApiProperty({ description: 'Ação realizada', example: 'início' })
  acao!: string;

  @Property({ nullable: true })
  @ApiProperty({ description: 'Detalhes adicionais sobre a ação', example: 'Início da etapa de corte', required: false })
  detalhes?: string;

  @ManyToOne(() => MotivoInterrupcao, { nullable: true })
  @ApiProperty({ description: 'Motivo de interrupção', type: () => MotivoInterrupcao, required: false })
  motivo_interrupcao?: MotivoInterrupcao;

  @Property()
  @ApiProperty({ description: 'Data e hora em que a ação foi registrada', example: '2023-10-01T12:00:00Z' })
  data_hora: Date = new Date();
}