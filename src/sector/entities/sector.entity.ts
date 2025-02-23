// src/entities/sector.entity.ts
import { Entity, PrimaryKey, Property, OneToMany, Collection } from '@mikro-orm/core';
import { SectorConfig } from './sector-config.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Sector {
  @ApiProperty({
    description: 'Nome do setor',
    example: 'Usinagem',
  })
  @PrimaryKey()
  id!: number;

  @Property()
  name!: string; // Nome do setor (ex.: Usinagem, Qualidade)

  @OneToMany(() => SectorConfig, (config) => config.sector)
  configs = new Collection<SectorConfig>(this); // Campos personalizados
}