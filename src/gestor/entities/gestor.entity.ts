// src/gestor/entities/gestor.entity.ts
import { Entity, PrimaryKey, Property, OneToOne } from '@mikro-orm/core';
import { Auth } from '../../auth/entities/auth.entity';

@Entity()
export class Gestao {
  @PrimaryKey()
  id!: number;

  @Property()
  code!: string; // Código do gestor

  @Property()
  name!: string;

  @Property()
  department!: string;

  @Property()
  role!: string;

  @OneToOne(() => Auth, (auth) => auth.gestao,{ owner: true, nullable: true }) // Campo auth é opcional
  auth?: Auth;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}