import { ApiProperty } from '@nestjs/swagger';

export interface HistoricoProducao {
  id: number;
  orderId: number;
  funcionarioId: number;
  acao: string;
  detalhes: string;
  motivoInterrupcaoId: number;
  data_hora: Date;
}


