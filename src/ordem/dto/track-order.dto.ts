// src/orders/dto/track-order.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class TrackOrderDto {
  @ApiProperty({
    description: 'ID da ordem de serviço',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  orderId: number; // ID da ordem de serviço

  @ApiProperty({
    description: 'Código do funcionário',
    example: 'FUNC001',
  })
  @IsString()
  @IsNotEmpty()
  employeeCode: string; // Código do funcionário

  @ApiProperty({
    description: 'Quantidade de peças perdidas',
    example: 5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  lostQuantity?: number; // Peças perdidas

  @ApiProperty({
    description: 'Quantidade de peças processadas',
    example: 100,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  processedQuantity?: number; // Peças processadas
}