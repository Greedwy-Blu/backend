import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { FuncionarioService } from './funcionario.service';
import { CreateFuncionarioDto } from './dto/create-funcionario';
import { UpdateFuncionarioDto } from './dto/update-funcionario';

@Controller('funcionario')
export class FuncionarioController {
  constructor(private readonly funcionarioService: FuncionarioService) {}

  @Post()
  async create(@Body() createFuncionarioDto: CreateFuncionarioDto) {
    return this.funcionarioService.create(createFuncionarioDto);
  }

  @Get()
  async findAll() {
    return this.funcionarioService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.funcionarioService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body() updateFuncionarioDto: UpdateFuncionarioDto) {
    return this.funcionarioService.update(id, updateFuncionarioDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.funcionarioService.remove(id);
  }
}