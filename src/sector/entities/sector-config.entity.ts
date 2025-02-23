// src/entities/sector-config.entity.ts
import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { Sector } from './sector.entity';

@Entity()
export class SectorConfig {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => Sector)
  sector!: Sector;

  @Property()
  fieldName!: string; // Nome do campo personalizado

  @Property()
  fieldType!: string; // Tipo do campo (ex.: number, string, date)
}