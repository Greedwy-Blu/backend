// src/orders/dto/create-order.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

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