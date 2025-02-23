import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Funcionario {
  @PrimaryKey()
  id: number;

  @Property()
  code: string;

  @Property()
  nome: string;

  @Property()
  cargo: string;

  @Property()
  salario: number;

  @Property()
  createdAt: Date = new Date(); // Valor padrão é a data atual

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date(); // Valor padrão é a data atual
}