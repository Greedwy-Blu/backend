// src/entities/sector-config.entity.ts
import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { Sector } from './sector.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class SectorConfig {
  @PrimaryKey()
  @ApiProperty({ description: 'ID único da configuração do setor', example: 1 })
  id!: number;

  @ManyToOne(() => Sector)
  @ApiProperty({ description: 'Setor associado', type: () => Sector })
  sector!: Sector;

  @Property()
  @ApiProperty({ description: 'Nome do campo personalizado', example: 'Temperatura Máxima' })
  fieldName!: string; // Nome do campo personalizado

  @Property()
  @ApiProperty({ description: 'Tipo do campo', example: 'number' })
  fieldType!: string; // Tipo do campo (ex.: number, string, date)
}