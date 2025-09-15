import { Module } from '@nestjs/common';
import { ProdutoService } from './produto.service';
import { ProductsController } from './produto.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [ProductsController],
  providers: [ProdutoService],
})
export class ProductsModule {}


