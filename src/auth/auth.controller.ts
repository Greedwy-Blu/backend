// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Request,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('auth') // Define a tag para o Swagger
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Criar um novo usuário' }) // Descrição da operação
  @ApiBody({ type: CreateAuthDto }) // Define o corpo da requisição
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  async register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Fazer login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login realizado com sucesso.' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
  async login(@Body() loginDto: LoginDto,@Request() req) {
    
    const auth = await this.authService.validateUser(loginDto.code, loginDto.password);
    return this.authService.login(auth);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('funcionario', 'gestao')
  @ApiBearerAuth() // Adiciona suporte a Bearer Token no Swagger
  @ApiOperation({ summary: 'Obter informações do usuário autenticado' })
  @ApiResponse({ status: 200, description: 'Informações do usuário retornadas com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 403, description: 'Acesso negado.' })
  async getProfile(@Request() req) {
    const auth = req.user;
    return auth;
  }

  @Post('validate-token')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Validar token de acesso' })
  @ApiResponse({ status: 200, description: 'Token válido.' })
  @ApiResponse({ status: 401, description: 'Token inválido ou expirado.' })
  async validateToken(@Request() req) {
    const user = req.user;
    const isValid = await this.authService.validateToken(user);
    if (!isValid) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }
    return { valid: true };
  }
}