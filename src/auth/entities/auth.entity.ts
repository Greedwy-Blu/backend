import { Entity, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Auth {
  @ApiProperty({
    description: 'ID único do usuário',
    example: 1,
  })
  @PrimaryKey()
  id!: number;

  @ApiProperty({
    description: 'Nome de usuário único',
    example: 'john_doe',
  })
  @Property()
  @Unique()
  username!: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'senha123',
  })
  @Property()
  password!: string;

  @ApiProperty({
    description: 'Token de autenticação',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    required: false,
  })
  @Property({ nullable: true })
  token?: string;

  @ApiProperty({
    description: 'Data de expiração do token',
    example: '2023-12-31T23:59:59.000Z',
    required: false,
  })
  @Property({ nullable: true })
  expiresAt?: Date;

  @ApiProperty({
    description: 'Papel do usuário',
    example: 'funcionario',
    enum: ['funcionario', 'gestor'],
  })
  @Property()
  role!: string;

  @ApiProperty({
    description: 'Data de criação do usuário',
    example: '2023-10-10T12:00:00.000Z',
  })
  @Property()
  createdAt: Date = new Date();

  @ApiProperty({
    description: 'Data da última atualização do usuário',
    example: '2023-10-10T12:00:00.000Z',
  })
  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}