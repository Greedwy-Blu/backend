import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './entities/produto.entity';
import { db } from '../config/database.config';

@Injectable()
export class ProdutoService {
  constructor() {}

  async create(productData: Partial<Product>): Promise<Product> {
    if (!productData.code || !productData.name || productData.price === undefined || productData.quantity === undefined) {
      throw new Error('Missing required fields');
    }
  
    const newProduct = await db.insertInto('product')
      .values({
        code: productData.code,
        name: productData.name,
        description: productData.description,
        price: productData.price,
        quantity: productData.quantity,
      })
      .returningAll()
      .executeTakeFirstOrThrow();
    return newProduct;
  }

  async findAll(): Promise<Product[]> {
    return db.selectFrom('product').selectAll().execute();
  }

  async findOne(id: number): Promise<Product> {
    const product = await db.selectFrom('product').selectAll().where('id', '=', id).executeTakeFirst();
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(id: number, updateData: Partial<Product>): Promise<Product> {
    const product = await db.selectFrom('product').selectAll().where('id', '=', id).executeTakeFirst();
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const updatedProduct = await db.updateTable('product')
      .set(updateData)
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirstOrThrow();
    return updatedProduct;
  }

  async remove(id: number): Promise<void> {
    const { numDeletedRows } = await db.deleteFrom('product').where('id', '=', id).executeTakeFirstOrThrow();
    if (Number(numDeletedRows) === 0) {
      throw new NotFoundException('Product not found');
    }
  }
}


