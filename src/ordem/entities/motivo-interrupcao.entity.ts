import { ApiProperty } from '@nestjs/swagger';

export class MotivoInterrupcao {
  @ApiProperty({ description: 'ID único do motivo de interrupção', example: 1 })
  id!: number;

  @ApiProperty({ description: 'Código do motivo de interrupção', example: 'M001' })
  codigo!: string;

  @ApiProperty({ description: 'Descrição do motivo de interrupção', example: 'Falta de material' })
  descricao!: string;
}


