// src/funcionario/entities/funcionario.entity.ts
import { Entity, PrimaryKey, Property, OneToOne } from '@mikro-orm/core';
import { Auth } from '../../auth/entities/auth.entity';

@Entity()
export class Funcionario {
  @PrimaryKey()
  id: number;

  @Property()
  code: string; // Código do funcionário

  @Property()
  nome: string;

  @Property()
  cargo: string;

  @Property()
  salario: number;

  @OneToOne(() => Auth, (auth) => auth.funcionario, { owner: true }) // Lado proprietário
  auth?: Auth;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}