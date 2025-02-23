
import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Funcionario {
  @PrimaryKey()
  id!: number;

  @Property()
  code!: string; // Código do funcionário

  @Property()
  name!: string; // Nome do funcionário
}