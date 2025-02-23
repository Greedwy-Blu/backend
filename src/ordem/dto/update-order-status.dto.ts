// src/orders/dto/update-order-status.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateOrderStatusDto {
  @ApiProperty({
    description: 'Novo status do pedido',
    example: 'em_andamento',
  })
  @IsString()
  @IsNotEmpty()
  status: string; // Novo status do pedido

  @ApiProperty({
    description: 'ID do motivo de interrupção (opcional)',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  motivoId?: number; // ID do motivo de interrupção (opcional)
}