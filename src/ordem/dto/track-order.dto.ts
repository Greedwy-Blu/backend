// src/orders/dto/track-order.dto.ts
import { IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class TrackOrderDto {
  @IsNumber()
  @IsNotEmpty()
  orderId: number; // ID da ordem de serviço

  @IsNumber()
  @IsNotEmpty()
  employeeCode: string; // Código do funcionário

  @IsOptional()
  @IsNumber()
  lostQuantity?: number; // Peças perdidas

  @IsOptional()
  @IsNumber()
  processedQuantity?: number; // Peças processadas
}