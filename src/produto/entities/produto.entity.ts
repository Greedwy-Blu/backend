import { ApiProperty } from '@nestjs/swagger';

export class Product {
  @ApiProperty({ description: 'ID único do produto', example: 1 })
  id!: number;

  @ApiProperty({ description: 'Código do produto', example: 'PROD001' })
  code!: string;

  @ApiProperty({ description: 'Nome do produto', example: 'Produto A' })
  name!: string;

  @ApiProperty({
    description: 'Descrição do produto',
    example: 'Descrição detalhada do produto',
    required: false,
  })
  description?: string;

  @ApiProperty({ description: 'Preço do produto', example: 99.99 })
  price!: number;

  @ApiProperty({ description: 'Quantidade em estoque', example: 100 })
  quantity!: number;
}


