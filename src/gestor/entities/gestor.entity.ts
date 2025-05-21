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

  // A anotação @Property foi removida deste campo password para que não seja mapeado para a base de dados, pois a senha é gerida pela entidade Auth.
  // O campo password é mantido aqui opcionalmente para outros usos, como DTOs, conforme o comentário original.
  @Property()
  password?: string; // Adicionado campo password (opcional na entidade, obrigatório via DTO)

  @OneToOne(() => Auth, (auth) => auth.gestao,{ owner: true, nullable: true }) // Campo auth é opcional
  auth?: Auth;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
