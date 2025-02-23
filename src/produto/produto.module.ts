import { Module } from '@nestjs/common';
import { ProdutoService } from './produto.service';
import { ProductsController } from './produto.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Product } from './entities/produto.entity';

@Module({
  imports: [MikroOrmModule.forFeature([Product])],
  controllers: [ProductsController],
  providers: [ProdutoService],
})
export class ProductsModule {}