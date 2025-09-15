import { ApiProperty } from '@nestjs/swagger';

export class Maquina {
  @ApiProperty({ description: 'ID único da máquina', example: 1 })
  id!: number;

  @ApiProperty({ description: 'Código da máquina', example: 'MAQ-001' })
  codigo!: string;

  @ApiProperty({ description: 'Nome da máquina', example: 'Torno CNC' })
  nome!: string;

  @ApiProperty({ description: 'Tipo da máquina', example: 'Torno' })
  tipo!: string;

  @ApiProperty({ description: 'Modelo da máquina', example: 'CNC-5000' })
  modelo!: string;

  @ApiProperty({ description: 'Fabricante da máquina', example: 'Romi' })
  fabricante!: string;

  @ApiProperty({ description: 'Capacidade da máquina', example: '500kg', required: false })
  capacidade?: string;

  @ApiProperty({ description: 'Status da máquina', example: 'ativa' })
  status!: string;

  @ApiProperty({ description: 'Data de criação do registro', example: '2023-10-01T12:00:00Z' })
  created_at!: Date;

  @ApiProperty({ description: 'Data de atualização do registro', example: '2023-10-01T14:00:00Z' })
  updated_at!: Date;
}


