import { Controller, Get, Post, Body, Param, Put, Delete, UnauthorizedException, Request, UseGuards } from '@nestjs/common';
import { FuncionarioService } from './funcionario.service';
import { CreateFuncionarioDto } from './dto/create-funcionario';
import { UpdateFuncionarioDto } from './dto/update-funcionario';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@ApiTags('funcionario') // Tag para agrupar endpoints no Swagger
@Controller('funcionario')

@UseGuards(JwtAuthGuard,RolesGuard)
export class FuncionarioController {
  constructor(
    private readonly funcionarioService: FuncionarioService,
   private readonly authService: AuthService,) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo funcionário' })
  @ApiBody({ type: CreateFuncionarioDto })
  @ApiResponse({ status: 201, description: 'Funcionário criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  async create(@Body() createFuncionarioDto: CreateFuncionarioDto,@Request() req) {
    const isValid = await this.authService.validateToken(req.user);
        if (!isValid) {
          throw new UnauthorizedException('Token inválido ou expirado');
        }
    return this.funcionarioService.create(createFuncionarioDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os funcionários' })
  @ApiResponse({ status: 200, description: 'Lista de funcionários retornada com sucesso.' })
  async findAll(@Request() req) {
    const isValid = await this.authService.validateToken(req.user);
        if (!isValid) {
          throw new UnauthorizedException('Token inválido ou expirado');
        }
    return this.funcionarioService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter um funcionário pelo ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do funcionário' })
  @ApiResponse({ status: 200, description: 'Funcionário encontrado.' })
  @ApiResponse({ status: 404, description: 'Funcionário não encontrado.' })
  async findOne(@Param('id') id: number,@Request() req) {
    const isValid = await this.authService.validateToken(req.user);
        if (!isValid) {
          throw new UnauthorizedException('Token inválido ou expirado');
        }
    return this.funcionarioService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar um funcionário pelo ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do funcionário' })
  @ApiBody({ type: UpdateFuncionarioDto })
  @ApiResponse({ status: 200, description: 'Funcionário atualizado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Funcionário não encontrado.' })
  async update(@Param('id') id: number, @Body() updateFuncionarioDto: UpdateFuncionarioDto,@Request() req) {
    const isValid = await this.authService.validateToken(req.user);
    if (!isValid) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
    return this.funcionarioService.update(id, updateFuncionarioDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover um funcionário pelo ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do funcionário' })
  @ApiResponse({ status: 200, description: 'Funcionário removido com sucesso.' })
  @ApiResponse({ status: 404, description: 'Funcionário não encontrado.' })
  async remove(@Param('id') id: number,@Request() req) {
    const isValid = await this.authService.validateToken(req.user);
    if (!isValid) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
    return this.funcionarioService.remove(id);
  }
}