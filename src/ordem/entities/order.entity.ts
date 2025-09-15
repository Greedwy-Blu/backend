import { ApiProperty } from '@nestjs/swagger';

export class Order {
  @ApiProperty({ description: 'ID único do pedido', example: 1 })
  id!: number;

  @ApiProperty({ description: 'Número da Ordem de Pedido (OP)', example: 'OP-12345' })
  orderNumber!: string;

  @ApiProperty({ description: 'Nome do pedido', example: 'Pedido de cortes especiais' })
  name!: string;

  // Foreign key to Product
  productId!: number;

  // Foreign key to Funcionario
  funcionarioResposavelId!: number;

  // Foreign key to Maquina
  maquinaId?: number;

  @ApiProperty({ description: 'Quantidade de peças no lote', example: 100 })
  lotQuantity!: number;

  @ApiProperty({ description: 'Destino final do lote', example: 'Setor de Montagem' })
  finalDestination!: string;

  @ApiProperty({ description: 'Status do pedido', example: 'aberto' })
  status: string = 'aberto';

  @ApiProperty({ description: 'Data de criação do pedido', example: '2023-10-01T12:00:00Z' })
  created_at!: Date;

  @ApiProperty({ description: 'Data de atualização do pedido', example: '2023-10-01T14:00:00Z' })
  updated_at!: Date;
}


