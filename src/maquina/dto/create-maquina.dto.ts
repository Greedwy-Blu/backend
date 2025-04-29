// src/maquina/dto/create-maquina.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateMaquinaDto {
  @ApiProperty({
    description: 'Código da máquina',
    example: 'MAQ-001',
  })
  @IsString()
  @IsNotEmpty()
  codigo: string;

  @ApiProperty({
    description: 'Nome da máquina',
    example: 'Torno CNC',
  })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({
    description: 'Tipo da máquina',
    example: 'Torno',
  })
  @IsString()
  @IsNotEmpty()
  tipo: string;

  @ApiProperty({
    description: 'Modelo da máquina',
    example: 'CNC-5000',
  })
  @IsString()
  @IsNotEmpty()
  modelo: string;

  @ApiProperty({
    description: 'Fabricante da máquina',
    example: 'Romi',
  })
  @IsString()
  @IsNotEmpty()
  fabricante: string;

  @ApiProperty({
    description: 'Capacidade da máquina',
    example: '500kg',
    required: false,
  })
  @IsString()
  @IsOptional()
  capacidade?: string;
}
