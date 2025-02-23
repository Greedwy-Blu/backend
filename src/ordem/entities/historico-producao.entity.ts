// src/entities/historico-producao.entity.ts
import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { Order } from './order.entity';
import { Funcionario } from '../../colaborador/entities/employee.entity';
import { MotivoInterrupcao } from './motivo-interrupcao.entity';


@Entity()
export class HistoricoProducao {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => Order)
  pedido!: Order;

  @ManyToOne(() => Funcionario)
  funcionario!: Funcionario;

  @Property()
  acao!: string;

  @Property({ nullable: true })
  detalhes?: string;

  @ManyToOne(() => MotivoInterrupcao, { nullable: true })
  motivo_interrupcao?: MotivoInterrupcao;

  @Property()
  data_hora: Date = new Date();
}