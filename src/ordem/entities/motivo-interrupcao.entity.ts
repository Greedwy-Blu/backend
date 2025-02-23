// src/entities/motivo-interrupcao.entity.ts
import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class MotivoInterrupcao {
  @PrimaryKey()
  id!: number;

  @Property()
  codigo!: string;

  @Property()
  descricao!: string;
}