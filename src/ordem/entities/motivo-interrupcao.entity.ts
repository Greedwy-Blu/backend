// src/entities/motivo-interrupcao.entity.ts
import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class MotivoInterrupcao {
  @PrimaryKey()
  @ApiProperty({ description: 'ID único do motivo de interrupção', example: 1 })
  id!: number;

  @Property()
  @ApiProperty({ description: 'Código do motivo de interrupção', example: 'M001' })
  codigo!: string;

  @Property()
  @ApiProperty({ description: 'Descrição do motivo de interrupção', example: 'Falta de material' })
  descricao!: string;
}