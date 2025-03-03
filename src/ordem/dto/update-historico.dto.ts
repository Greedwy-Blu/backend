import { IsNumber, IsString, IsDate, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateHistoricoProducaoDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: 'ID do pedido associado', example: 1, required: false })
  pedidoId?: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: 'ID do funcionário responsável', example: 1, required: false })
  funcionarioId?: number;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Ação realizada', example: 'início', required: false })
  acao?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Detalhes adicionais sobre a ação', example: 'Início da etapa de corte', required: false })
  detalhes?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: 'ID do motivo de interrupção', example: 1, required: false })
  motivoInterrupcaoId?: number;

  @IsDate()
  @IsOptional()
  @ApiProperty({ description: 'Data e hora em que a ação foi registrada', example: '2023-10-01T12:00:00Z', required: false })
  dataHora?: Date;
}