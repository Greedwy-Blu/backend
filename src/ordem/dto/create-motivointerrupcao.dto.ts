import { IsString, IsNotEmpty, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMotivoInterrupcaoDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 10)
  @ApiProperty({ description: 'Código do motivo de interrupção', example: 'M001' })
  codigo: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Descrição do motivo de interrupção', example: 'Falta de material' })
  descricao: string;
}