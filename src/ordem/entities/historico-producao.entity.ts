import { ApiProperty } from '@nestjs/swagger';

export class HistoricoProducao {
  @ApiProperty({ description: 'ID único do histórico', example: 1 })
  id!: number;

  // Foreign key to Order
  orderId!: number;

  // Foreign key to Funcionario
  funcionarioId!: number;

  @ApiProperty({ description: 'Ação realizada', example: 'início' })
  acao!: string;

  @ApiProperty({ description: 'Detalhes adicionais sobre a ação', example: 'Início da etapa de corte', required: false })
  detalhes?: string;

  // Foreign key to MotivoInterrupcao
  motivoInterrupcaoId?: number;

  @ApiProperty({ description: 'Data e hora em que a ação foi registrada', example: '2023-10-01T12:00:00Z' })
  data_hora!: Date;
}


