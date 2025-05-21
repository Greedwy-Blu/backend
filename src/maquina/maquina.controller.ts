// src/maquina/maquina.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { MaquinaService } from './maquina.service';
import { CreateMaquinaDto } from './dto/create-maquina.dto';
import { UpdateMaquinaDto } from './dto/update-maquina.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthService } from '../auth/auth.service';

@ApiTags('maquinas')
@ApiBearerAuth()
@Controller('maquinas')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MaquinaController {
  constructor(
    private readonly maquinaService: MaquinaService,
    private readonly authService: AuthService,
  ) {}

  private async validateUser(req: any) {
    const isValid = await this.authService.validateToken(req.user);
    if (!isValid) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }

  @Post()
  @Roles('gestao')
  @ApiOperation({ summary: 'Criar uma nova máquina' })
  @ApiResponse({ status: 201, description: 'Máquina criada com sucesso.' })
  async create(@Body() createMaquinaDto: CreateMaquinaDto, @Request() req) {
    await this.validateUser(req);
    return this.maquinaService.create(createMaquinaDto);
  }

  @Get()
  @Roles('gestao', 'funcionario')
  @ApiOperation({ summary: 'Listar todas as máquinas' })
  @ApiResponse({ status: 200, description: 'Lista de máquinas retornada com sucesso.' })
  async findAll(@Request() req) {
    await this.validateUser(req);
    return this.maquinaService.findAll();
  }

  @Get(':id')
  @Roles('gestao', 'funcionario')
  @ApiOperation({ summary: 'Obter detalhes de uma máquina por ID' })
  @ApiResponse({ status: 200, description: 'Detalhes da máquina retornados com sucesso.' })
  @ApiResponse({ status: 404, description: 'Máquina não encontrada.' })
  @ApiParam({ name: 'id', description: 'ID da máquina', example: 1 })
  async findOne(@Param('id') id: string, @Request() req) {
    await this.validateUser(req);
    const maquina = await this.maquinaService.findOne(+id);
    if (!maquina) {
      throw new NotFoundException(`Máquina com ID ${id} não encontrada.`);
    }
    return maquina;
  }

  @Patch(':id')
  @Roles('gestao')
  @ApiOperation({ summary: 'Atualizar uma máquina por ID' })
  @ApiResponse({ status: 200, description: 'Máquina atualizada com sucesso.' })
  @ApiResponse({ status: 404, description: 'Máquina não encontrada.' })
  @ApiParam({ name: 'id', description: 'ID da máquina', example: 1 })
  async update(
    @Param('id') id: string,
    @Body() updateMaquinaDto: UpdateMaquinaDto,
    @Request() req,
  ) {
    await this.validateUser(req);
    return this.maquinaService.update(+id, updateMaquinaDto);
  }

  @Delete(':id')
  @Roles('gestao')
  @ApiOperation({ summary: 'Remover uma máquina por ID' })
  @ApiResponse({ status: 200, description: 'Máquina removida com sucesso.' })
  @ApiResponse({ status: 404, description: 'Máquina não encontrada.' })
  @ApiParam({ name: 'id', description: 'ID da máquina', example: 1 })
  async remove(@Param('id') id: string, @Request() req) {
    await this.validateUser(req);
    return this.maquinaService.remove(+id);
  }
}
