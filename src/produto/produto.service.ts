import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, EntityManager,RequiredEntityData } from '@mikro-orm/core'; // Adicione EntityManager
import { Product } from './entities/produto.entity'; // Verifique o caminho

@Injectable()
export class ProdutoService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: EntityRepository<Product>,
    private readonly em: EntityManager, // Injete o EntityManager
  ) {}

  async create(productData: Partial<Product>): Promise<Product> {
    if (!productData.code || !productData.name || productData.price === undefined || productData.quantity === undefined) {
      throw new Error('Missing required fields');
    }
  
    const product = this.productRepository.create(productData as RequiredEntityData<Product>);
    await this.em.persistAndFlush(product);
    return product;
  }

  async findAll(): Promise<Product[]> {
    const connection = this.em.getConnection();
     const result = await connection.execute('SELECT * FROM product');
     
     // Converter os resultados brutos para instâncias da entidade
     return result.map(item => this.em.map(Product, item));
  }

  // Retorna um produto pelo ID
  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(id: number, updateData: Partial<Product>): Promise<Product> {
    const product = await this.productRepository.findOne(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    this.productRepository.assign(product, updateData); // Atualize os dados
    await this.em.flush(); // Use o EntityManager
    return product;
  }

  async remove(id: number): Promise<void> {
    const product = await this.productRepository.findOne(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.em.removeAndFlush(product); // Use o EntityManager
  }
}