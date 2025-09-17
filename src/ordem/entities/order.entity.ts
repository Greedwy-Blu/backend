import { Product } from '../../produto/entities/produto.entity';
import { Funcionario } from '../../colaborador/entities/funcionario.entity';
import { Maquina } from '../../maquina/entities/maquina.entity';

export interface Order {
  id: number;
  name: string;
  status: string;
  created_at: Date;
  updated_at: Date;
  orderNumber: string;
  lotQuantity: number;
  finalDestination: string;
  productId: number;
  funcionarioResposavelId: number;
  maquinaId?: number;
  product?: Product;
  funcionarioResposavel?: Funcionario;
  maquina?: Maquina;
}

export interface OrderTracking {
  id: number;
  orderId: number;
  funcionarioId: number;
  startTime: Date;
  endTime?: Date;
  processedQuantity?: number;
  lostQuantity?: number;
}

export interface Etapa {
  id: number;
  nome: string;
  orderId: number;
  funcionarioId: number;
  inicio?: Date;
  fim?: Date;
}

export interface HistoricoProducao {
  id: number;
  orderId: number;
  funcionarioId: number;
  acao: string;
  detalhes?: string;
  motivoInterrupcaoId?: number;
  data_hora: Date;
}

export interface MotivoInterrupcao {
  id: number;
  descricao: string;
}


