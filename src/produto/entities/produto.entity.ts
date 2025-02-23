import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Product {
  @PrimaryKey()
  id!: number;

  @Property()
  code!: string; // Código do produto

  @Property()
  name!: string; // Nome do produto

  @Property()
  description?: string; // Descrição do produto (opcional)

  @Property()
  price!: number; // Preço do produto

  @Property()
  quantity!: number; // Quantidade em estoque
}