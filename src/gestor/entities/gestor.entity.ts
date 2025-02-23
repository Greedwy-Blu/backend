import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Gestao {
  @PrimaryKey()
  id!: number;

  @Property()
  code!: string; // Código do gestor

  @Property()
  name!: string; // Nome do gestor

  @Property()
  department!: string; // Departamento do gestor

  @Property()
  role!: string; // Cargo do gestor

  @Property()
  createdAt: Date = new Date(); // Data de criação

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date(); // Data de atualização
}