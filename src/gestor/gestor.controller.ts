import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { GestaoService } from './gestor.service';
import { CreateGestorDto } from './dto/create-gestor.dto';
import { UpdateGestorDto } from './dto/update-gestor.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('gestao')
@Controller('gestao')
@UseGuards(RolesGuard)
export class GestaoController {
  constructor(private readonly gestaoService: GestaoService) {}

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Criar um novo gestor' })
  @ApiBody({ type: CreateGestorDto })
  @ApiResponse({ status: 201, description: 'Gestor criado com sucesso.' })
  @ApiResponse({ status: 403, description: 'Acesso negado.' })
  async create(@Body() createGestorDto: CreateGestorDto) {
    return this.gestaoService.create(createGestorDto);
  }

  @Get()
  @Roles('admin', 'gestao')
  @ApiOperation({ summary: 'Listar todos os gestores' })
  @ApiResponse({ status: 200, description: 'Lista de gestores retornada com sucesso.' })
  async findAll() {
    return this.gestaoService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'gestao')
  @ApiOperation({ summary: 'Obter um gestor pelo ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do gestor' })
  @ApiResponse({ status: 200, description: 'Gestor encontrado.' })
  @ApiResponse({ status: 404, description: 'Gestor não encontrado.' })
  async findOne(@Param('id') id: number) {
    return this.gestaoService.findOne(id);
  }

  @Put(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Atualizar um gestor pelo ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do gestor' })
  @ApiBody({ type: UpdateGestorDto })
  @ApiResponse({ status: 200, description: 'Gestor atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Gestor não encontrado.' })
  async update(@Param('id') id: number, @Body() updateGestorDto: UpdateGestorDto) {
    return this.gestaoService.update(id, updateGestorDto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Remover um gestor pelo ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do gestor' })
  @ApiResponse({ status: 200, description: 'Gestor removido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Gestor não encontrado.' })
  async remove(@Param('id') id: number) {
    return this.gestaoService.remove(id);
  }
}