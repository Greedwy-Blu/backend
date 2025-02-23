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
  department!: string; // Departamento do gestor (ex.: Produção, Qualidade)

  @Property()
  role!: string; // Cargo do gestor (ex.: Gerente de Produção, Gerente de Qualidade)
}