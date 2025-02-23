// src/users/entities/user.entity.ts
import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class User {
  @PrimaryKey()
  id!: number;

  @Property()
  username!: string; // Nome de usuário (único)

  @Property()
  password!: string; // Senha (hash)

  @Property()
  role!: string; // Papel do usuário (ex.: 'manager', 'employee')
}