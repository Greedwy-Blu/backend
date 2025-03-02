// src/auth/entities/auth.entity.ts
import { Entity, PrimaryKey, Property, ManyToOne, OneToOne } from '@mikro-orm/core';
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

  @Property()
  role: string; // 'funcionario' ou 'gestor'

  @OneToOne(() => Funcionario, (funcionario) => funcionario.auth) // Lado inverso
  funcionario?: Funcionario;

  @OneToOne(() => Gestao, (gestao) => gestao.auth) // Lado inverso
  gestao?: Gestao;
  
  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}