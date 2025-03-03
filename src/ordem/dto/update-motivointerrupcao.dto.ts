import { IsString, IsOptional, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMotivoInterrupcaoDto {
  @IsString()
  @IsOptional()
  @Length(1, 10)
  @ApiProperty({ description: 'Código do motivo de interrupção', example: 'M001', required: false })
  codigo?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Descrição do motivo de interrupção', example: 'Falta de material', required: false })
  descricao?: string;
}