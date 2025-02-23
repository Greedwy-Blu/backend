// src/produto/dto/create-product.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Código do produto',
    example: 'PROD001',
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    description: 'Nome do produto',
    example: 'Produto A',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Descrição do produto',
    example: 'Descrição detalhada do produto',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Preço do produto',
    example: 99.99,
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: 'Quantidade em estoque',
    example: 100,
  })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}