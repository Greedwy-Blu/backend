import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ProdutoService } from './produto.service';
import { CreateProductDto } from './dto/create-produto.dto';
import { UpdateProductDto } from './dto/update-produto.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('products')
@UseGuards(RolesGuard)
export class ProductsController {
  constructor(private readonly productsService: ProdutoService) {}

  @Post()
  @Roles('manager') // Apenas gestores podem criar produtos
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @Roles('manager', 'employee') // Gestores e funcionários podem listar produtos
  async findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @Roles('manager', 'employee') // Gestores e funcionários podem buscar um produto por ID
  async findOne(@Param('id') id: number) {
    return this.productsService.findOne(id);
  }

  @Put(':id')
  @Roles('manager') // Apenas gestores podem atualizar produtos
  async update(@Param('id') id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @Roles('manager') // Apenas gestores podem excluir produtos
  async remove(@Param('id') id: number) {
    return this.productsService.remove(id);
  }
}