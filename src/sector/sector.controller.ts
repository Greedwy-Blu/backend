// src/sectors/sectors.controller.ts
import { AddSectorConfigDto } from './dto/add-sector-config.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  NotFoundException,
  ParseIntPipe,
} from '@nestjs/common';
import { SectorsService } from './sector.service';
import { CreateSectorDto } from './dto/createSector.dto';
import { UpdateSectorDto } from './dto/updateSector.dto';


@ApiTags('sectors')
@ApiBearerAuth()
@Controller('sectors')
export class SectorsController {
  constructor(private readonly sectorsService: SectorsService) {}
  @Post()
  @ApiOperation({ summary: 'Criar um novo setor' })
  @ApiBody({ type: CreateSectorDto })
  @ApiResponse({ status: 201, description: 'Setor criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  async create(@Body() createSectorDto: CreateSectorDto) {
    return this.sectorsService.create(createSectorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os setores' })
  @ApiResponse({ status: 200, description: 'Lista de setores retornada com sucesso.' })
  async findAll() {
    return this.sectorsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter um setor pelo ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do setor' })
  @ApiResponse({ status: 200, description: 'Setor encontrado.' })
  @ApiResponse({ status: 404, description: 'Setor não encontrado.' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.sectorsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar um setor pelo ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do setor' })
  @ApiBody({ type: UpdateSectorDto })
  @ApiResponse({ status: 200, description: 'Setor atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Setor não encontrado.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSectorDto: UpdateSectorDto,
  ) {
    return this.sectorsService.update(id, updateSectorDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um setor pelo ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do setor' })
  @ApiResponse({ status: 200, description: 'Setor removido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Setor não encontrado.' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.sectorsService.remove(id);
  }

  @Post(':id/config')
  @ApiOperation({ summary: 'Adicionar uma configuração personalizada a um setor' })
  @ApiResponse({
    status: 201,
    description: 'Configuração adicionada com sucesso.',
  })
  @ApiParam({ name: 'id', description: 'ID do setor', example: 1 })
  @ApiBody({ type: AddSectorConfigDto })
  async addConfig(
    @Param('id') id: number,
    @Body() addSectorConfigDto: AddSectorConfigDto,
  ) {
    return this.sectorsService.addConfig(id, addSectorConfigDto);
  }
}