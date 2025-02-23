// src/produto/dto/update-product.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateProductDto {
  @ApiProperty({
    description: 'Código do produto',
    example: 'PROD001',
    required: false,
  })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiProperty({
    description: 'Nome do produto',
    example: 'Produto A',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

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
    required: false,
  })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({
    description: 'Quantidade em estoque',
    example: 100,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  quantity?: number;
}