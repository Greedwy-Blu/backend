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
  UseGuards,
  UnauthorizedException,
  Request,
} from '@nestjs/common';
import { SectorsService } from './sector.service';
import { CreateSectorDto } from './dto/createSector.dto';
import { UpdateSectorDto } from './dto/updateSector.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { AuthService } from 'src/auth/auth.service';


@ApiTags('sectors')
@ApiBearerAuth()
@Controller('sectors')
@UseGuards(JwtAuthGuard, RolesGuard) // Aplica o guard de roles a todos os endpoints do controller

export class SectorsController {
  constructor(
    private readonly sectorsService: SectorsService,
    private readonly authService: AuthService,
  ) {}
  @Post()
  @Roles('gestor')
  @ApiOperation({ summary: 'Criar um novo setor' })
  @ApiBody({ type: CreateSectorDto })
  @ApiResponse({ status: 201, description: 'Setor criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  async create(@Body() createSectorDto: CreateSectorDto, @Request() req) {
     const isValid = await this.authService.validateToken(req.user);
        if (!isValid) {
          throw new UnauthorizedException('Token inválido ou expirado');
        }
    return this.sectorsService.create(createSectorDto);
  }

  @Get()
  @Roles('gestor')
  @ApiOperation({ summary: 'Listar todos os setores' })
  @ApiResponse({ status: 200, description: 'Lista de setores retornada com sucesso.' })
  async findAll(@Request() req) {
    const isValid = await this.authService.validateToken(req.user);
        if (!isValid) {
          throw new UnauthorizedException('Token inválido ou expirado');
        }
    return this.sectorsService.findAll();
  }

  @Get(':id')
  @Roles('gestor')
  @ApiOperation({ summary: 'Obter um setor pelo ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do setor' })
  @ApiResponse({ status: 200, description: 'Setor encontrado.' })
  @ApiResponse({ status: 404, description: 'Setor não encontrado.' })
  async findOne(@Param('id', ParseIntPipe) id: number,@Request() req) {
    const isValid = await this.authService.validateToken(req.user);
    if (!isValid) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
    return this.sectorsService.findOne(id);
  }

  @Put(':id')
  @Roles('gestor')
  @ApiOperation({ summary: 'Atualizar um setor pelo ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do setor' })
  @ApiBody({ type: UpdateSectorDto })
  @ApiResponse({ status: 200, description: 'Setor atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Setor não encontrado.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSectorDto: UpdateSectorDto,
    @Request() req,
  ) {
    const isValid = await this.authService.validateToken(req.user);
    if (!isValid) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
    return this.sectorsService.update(id, updateSectorDto);
  }

  @Delete(':id')
  @Roles('gestor')
  @ApiOperation({ summary: 'Remover um setor pelo ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do setor' })
  @ApiResponse({ status: 200, description: 'Setor removido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Setor não encontrado.' })
  async remove(@Param('id', ParseIntPipe) id: number,@Request() req) {
    const isValid = await this.authService.validateToken(req.user);
    if (!isValid) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
    return this.sectorsService.remove(id);
  }

  @Post(':id/config')
  @Roles('gestor')
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
    @Request() req
  ) {
    const isValid = await this.authService.validateToken(req.user);
    if (!isValid) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
    return this.sectorsService.addConfig(id, addSectorConfigDto);
  }
}