// src/produto/products.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { ProdutoService } from './produto.service';
import { CreateProductDto } from './dto/create-produto.dto';
import { UpdateProductDto } from './dto/update-produto.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuthService } from 'src/auth/auth.service';

@ApiTags('products')
@ApiBearerAuth() // Adiciona suporte a autenticação via Bearer Token no Swagger
@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard) // Aplica o guard de roles a todos os endpoints do controller
export class ProductsController {
  constructor(
    private readonly productsService: ProdutoService,
     private readonly authService: AuthService,
  ) {}

  @Post()
   // Protege a rota com JWT e Roles
  @Roles('gestao') // Apenas gestores podem criar produtos
  @ApiOperation({ summary: 'Criar um novo produto' })
  @ApiResponse({
    status: 201,
    description: 'Produto criado com sucesso.',
  })
  @ApiBody({ type: CreateProductDto })
  async create(@Body() createProductDto: CreateProductDto, @Request() req) {

     
    
    return this.productsService.create(createProductDto);
  }

  @Get()
  @Roles('gestao', 'funcionario') // Gestores e funcionários podem listar produtos
  @ApiOperation({ summary: 'Listar todos os produtos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de produtos retornada com sucesso.',
  })
  async findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @Roles('gestao', 'funcionario') // Gestores e funcionários podem buscar um produto por ID
  @ApiOperation({ summary: 'Buscar um produto por ID' })
  @ApiResponse({
    status: 200,
    description: 'Produto encontrado com sucesso.',
  })
  @ApiParam({ name: 'id', description: 'ID do produto', example: 1 })
  async findOne(@Param('id') id: number, @Request() req) {
   
    return this.productsService.findOne(id);
  }

  @Put(':id')
  @Roles('gestao') // Apenas gestores podem atualizar produtos
  @ApiOperation({ summary: 'Atualizar um produto existente' })
  @ApiResponse({
    status: 200,
    description: 'Produto atualizado com sucesso.',
  })
  @ApiParam({ name: 'id', description: 'ID do produto', example: 1 })
  @ApiBody({ type: UpdateProductDto })
  async update(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto, @Request() req
  ) {
    
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @Roles('gestao') // Apenas gestores podem excluir produtos
  @ApiOperation({ summary: 'Excluir um produto' })
  @ApiResponse({
    status: 200,
    description: 'Produto excluído com sucesso.',
  })
  @ApiParam({ name: 'id', description: 'ID do produto', example: 1 })
  async remove(@Param('id') id: number, @Request() req) {
   
    return this.productsService.remove(id);
  }
}