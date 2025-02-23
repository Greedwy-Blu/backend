// src/orders/dto/create-order.dto.ts
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  productCode: string; // Código do produto

  @IsString()
  @IsNotEmpty()
  employeeCode: string; // Código do funcionário

  @IsNumber()
  @IsNotEmpty()
  lotQuantity: number; // Quantidade do lote

  @IsString()
  @IsNotEmpty()
  finalDestination: string; // Destino final
}