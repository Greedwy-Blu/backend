import { IsNumber, IsNotEmpty, Min } from 'class-validator';

export class UpdateQuantidadeProcessadaDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(0) // Garante que a quantidade não seja negativa
  quantidadeProcessada: number; // Nova quantidade de peças processadas
}