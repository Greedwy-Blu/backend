// src/auth/entities/auth.entity.ts
import { Entity, PrimaryKey, Property, OneToOne } from '@mikro-orm/core';
import { Funcionario } from '../../colaborador/entities/funcionario.entity';
import { Gestao } from '../../gestor/entities/gestor.entity';

@Entity()
export class Auth {
  @PrimaryKey()
  id: number;

  @Property()
  code: string; // Código do usuário (chave estrangeira)

  @Property()
  password: string;

  @Property({ nullable: true }) // Token de acesso (opcional)
  accessToken?: string;

  @Property({ nullable: true }) // Data de expiração do token (opcional)
  tokenExpiresAt?: Date;

  @Property()
  role: string; // 'funcionario' ou 'gestor'

  @OneToOne(() => Funcionario, (funcionario) => funcionario.auth, { nullable: true }) // Campo funcionario é opcional
  funcionario?: Funcionario;

  @OneToOne(() => Gestao, (gestao) => gestao.auth, { nullable: true }) // Campo gestao é opcional
  gestao?: Gestao;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}