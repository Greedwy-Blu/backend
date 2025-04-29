// src/orders/dto/create-order.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Código do produto',
    example: 'PROD001',
  })
  @IsString()
  @IsNotEmpty()
  productCode: string; // Código do produto

  @ApiProperty({
    description: 'Código do funcionário',
    example: 'FUNC001',
  })
  @IsString()
  @IsNotEmpty()
  employeeCode: string; // Código do funcionário

  @ApiProperty({
    description: 'Código da máquina designada (opcional)',
    example: 'MAQ-001',
    required: false,
  })
  @IsString()
  @IsOptional() // Make machine code optional
  maquinaCodigo?: string; // Código da máquina

  @ApiProperty({
    description: 'Quantidade do lote',
    example: 100,
  })
  @IsNumber()
  @IsNotEmpty()
  lotQuantity: number; // Quantidade do lote

  @ApiProperty({
    description: 'Destino final do lote',
    example: 'Setor de Montagem',
  })
  @IsString()
  @IsNotEmpty()
  finalDestination: string; // Destino final
}
