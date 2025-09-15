import { ApiProperty } from '@nestjs/swagger';

export class Etapa {
  @ApiProperty({ description: 'ID único da etapa', example: 1 })
  id!: number;

  @ApiProperty({ description: 'Nome da etapa', example: 'Corte' })
  nome!: string;

  // Foreign key to Order
  orderId!: number;

  // Foreign key to Funcionario
  funcionarioId!: number;

  @ApiProperty({ description: 'Horário de início da etapa', example: '2023-10-01T12:00:00Z', required: false })
  inicio?: Date;

  @ApiProperty({ description: 'Horário de término da etapa', example: '2023-10-01T14:00:00Z', required: false })
  fim?: Date;
}


