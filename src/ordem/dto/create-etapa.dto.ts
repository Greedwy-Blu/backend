// src/orders/dto/create-etapa.dto.ts
// src/orders/dto/create-etapa.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateEtapaDto {
  @ApiProperty({
    description: 'Nome da etapa',
    example: 'Corte',
  })
  @IsString()
  @IsNotEmpty()
  nome: string; // Nome da etapa

  @ApiProperty({
    description: 'Código do funcionário responsável',
    example: 'FUNC001',
  })
  @IsString()
  @IsNotEmpty()
  funcionarioCode: string; // Código do funcionário responsável
}