// src/gestao/gestao.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { GestaoService } from './gestor.service';
import { CreateGestorDto  } from './dto/create-gestor.dto';
import { UpdateGestorDto } from './dto/update-gestor.dto';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('gestao')
@UseGuards(RolesGuard)
export class GestaoController {
  constructor(private readonly gestaoService: GestaoService) {}

  @Post()
  @Roles('admin') // Apenas admin pode criar gestores
  async create(@Body() createGestaoDto: CreateGestorDto) {
    return this.gestaoService.create(createGestaoDto);
  }

  @Get()
  @Roles('admin', 'gestao') // Admin e gestores podem listar gestores
  async findAll() {
    return this.gestaoService.findAll();
  }

  @Get(':id')
  @Roles('admin', 'gestao') // Admin e gestores podem buscar um gestor por ID
  async findOne(@Param('id') id: number) {
    return this.gestaoService.findOne(id);
  }

  @Put(':id')
  @Roles('admin') // Apenas admin pode atualizar gestores
  async update(@Param('id') id: number, @Body() updateGestaoDto: UpdateGestorDto) {
    return this.gestaoService.update(id, updateGestaoDto);
  }

  @Delete(':id')
  @Roles('admin') // Apenas admin pode excluir gestores
  async remove(@Param('id') id: number) {
    return this.gestaoService.remove(id);
  }
}