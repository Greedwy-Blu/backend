import { ApiProperty } from '@nestjs/swagger';

export class SectorConfig {
  @ApiProperty({ description: 'ID único da configuração do setor', example: 1 })
  id!: number;

  // Foreign key to Sector
  sectorId!: number;

  @ApiProperty({ description: 'Nome do campo personalizado', example: 'Temperatura Máxima' })
  fieldName!: string;

  @ApiProperty({ description: 'Tipo do campo', example: 'number' })
  fieldType!: string;
}


