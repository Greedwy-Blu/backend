import { Module } from '@nestjs/common';
import { ProdutoService } from './produto.service';
import { ProductsController } from './produto.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Product } from './entities/produto.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [MikroOrmModule.forFeature([Product]), AuthModule,],
  controllers: [ProductsController],
  providers: [ProdutoService],
})
export class ProductsModule {}