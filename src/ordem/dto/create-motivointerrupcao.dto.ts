import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateMotivoInterrupcaoDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 10) // Define um comprimento máximo e mínimo para o código
  codigo: string; // Código único do motivo de interrupção

  @IsString()
  @IsNotEmpty()
  descricao: string; // Descrição do motivo de interrupção
}