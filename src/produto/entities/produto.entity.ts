// src/produto/entities/produto.entity.ts
import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Product {
  @PrimaryKey()
  @ApiProperty({ description: 'ID único do produto', example: 1 })
  id!: number;

  @Property()
  @ApiProperty({ description: 'Código do produto', example: 'PROD001' })
  code!: string; // Código do produto

  @Property()
  @ApiProperty({ description: 'Nome do produto', example: 'Produto A' })
  name!: string; // Nome do produto

  @Property({ nullable: true })
  @ApiProperty({
    description: 'Descrição do produto',
    example: 'Descrição detalhada do produto',
    required: false,
  })
  description?: string; // Descrição do produto (opcional)

  @Property()
  @ApiProperty({ description: 'Preço do produto', example: 99.99 })
  price!: number; // Preço do produto

  @Property()
  @ApiProperty({ description: 'Quantidade em estoque', example: 100 })
  quantity!: number; // Quantidade em estoque
}