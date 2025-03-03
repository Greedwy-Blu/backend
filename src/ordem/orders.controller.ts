import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { TrackOrderDto } from './dto/track-order.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthService } from '../auth/auth.service';

@ApiTags('orders')
@ApiBearerAuth()
@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard) // Adicionar JwtAuthGuard
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly authService: AuthService, // Injetar o AuthService
  ) {}

  @Post()
  @Roles('gestor')
  @ApiOperation({ summary: 'Criar um novo pedido' })
  @ApiResponse({
    status: 201,
    description: 'Pedido criado com sucesso.',
  })
  @ApiBody({ type: CreateOrderDto })
  async create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    console.log('Usuário autenticado:', req.user); // Verifique o objeto user

    const isValid = await this.authService.validateToken(req.user);
    if (!isValid) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }

    return this.ordersService.create(createOrderDto);
  }

  @Post('start-tracking')
  @Roles('gestor')
  @ApiOperation({ summary: 'Iniciar o rastreamento de uma ordem' })
  @ApiResponse({
    status: 201,
    description: 'Rastreamento iniciado com sucesso.',
  })
  @ApiBody({ type: TrackOrderDto })
  async startTracking(@Body() trackOrderDto: TrackOrderDto, @Request() req) {
    // Valida o token manualmente (opcional)
    const isValid = await this.authService.validateToken(req.user);
    if (!isValid) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }

    return this.ordersService.startTracking(trackOrderDto);
  }

  @Post('end-tracking/:id')
  @Roles('gestor')
  @ApiOperation({ summary: 'Finalizar o rastreamento de uma ordem' })
  @ApiResponse({
    status: 200,
    description: 'Rastreamento finalizado com sucesso.',
  })
  @ApiParam({ name: 'id', description: 'ID do rastreamento', example: 1 })
  @ApiBody({ type: TrackOrderDto })
  async endTracking(@Param('id') id: number, @Body() trackOrderDto: TrackOrderDto, @Request() req) {
    // Valida o token manualmente (opcional)
    const isValid = await this.authService.validateToken(req.user);
    if (!isValid) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }

    return this.ordersService.endTracking(id, trackOrderDto);
  }

  @Get('report/:id')
  @Roles('gestor')
  @ApiOperation({ summary: 'Obter relatório de uma ordem' })
  @ApiResponse({
    status: 200,
    description: 'Relatório retornado com sucesso.',
  })
  @ApiParam({ name: 'id', description: 'ID da ordem', example: 1 })
  async getOrderReport(@Param('id') id: number, @Request() req) {
    // Valida o token manualmente (opcional)
    const isValid = await this.authService.validateToken(req.user);
    if (!isValid) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }

    return this.ordersService.getOrderReport(id);
  }

  @Post(':id/etapas')
  @Roles('gestor')
  @ApiOperation({ summary: 'Criar uma nova etapa para uma ordem' })
  @ApiResponse({
    status: 201,
    description: 'Etapa criada com sucesso.',
  })
  @ApiParam({ name: 'id', description: 'ID da ordem', example: 1 })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nome: { type: 'string', example: 'Corte' },
        funcionarioCode: { type: 'string', example: 'FUNC001' },
      },
    },
  })
  async createEtapa(
    @Param('id') orderId: number,
    @Body('nome') nome: string,
    @Body('funcionarioCode') funcionarioCode: string,
    @Request() req,
  ) {
    // Valida o token manualmente (opcional)
    const isValid = await this.authService.validateToken(req.user);
    if (!isValid) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }

    return this.ordersService.createEtapa(orderId, nome, funcionarioCode);
  }

  @Post('etapas/:id/iniciar')
  @Roles('gestor')
  @ApiOperation({ summary: 'Iniciar uma etapa' })
  @ApiResponse({
    status: 200,
    description: 'Etapa iniciada com sucesso.',
  })
  @ApiParam({ name: 'id', description: 'ID da etapa', example: 1 })
  async startEtapa(@Param('id') etapaId: number, @Request() req) {
    // Valida o token manualmente (opcional)
    const isValid = await this.authService.validateToken(req.user);
    if (!isValid) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }

    return this.ordersService.startEtapa(etapaId);
  }

  @Post('etapas/:id/finalizar')
  @Roles('gestor')
  @ApiOperation({ summary: 'Finalizar uma etapa' })
  @ApiResponse({
    status: 200,
    description: 'Etapa finalizada com sucesso.',
  })
  @ApiParam({ name: 'id', description: 'ID da etapa', example: 1 })
  async endEtapa(@Param('id') etapaId: number, @Request() req) {
    // Valida o token manualmente (opcional)
    const isValid = await this.authService.validateToken(req.user);
    if (!isValid) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }

    return this.ordersService.endEtapa(etapaId);
  }

  @Get(':id/etapas')
  @Roles('gestor')
  @ApiOperation({ summary: 'Listar etapas de uma ordem' })
  @ApiResponse({
    status: 200,
    description: 'Etapas retornadas com sucesso.',
  })
  @ApiParam({ name: 'id', description: 'ID da ordem', example: 1 })
  async listEtapasByOrder(@Param('id') orderId: number, @Request() req) {
    // Valida o token manualmente (opcional)
    const isValid = await this.authService.validateToken(req.user);
    if (!isValid) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }

    return this.ordersService.listEtapasByOrder(orderId);
  }

  @Post(':id/atualizar-status')
  @Roles('gestor')
  @ApiOperation({ summary: 'Atualizar o status de uma ordem' })
  @ApiResponse({
    status: 200,
    description: 'Status atualizado com sucesso.',
  })
  @ApiParam({ name: 'id', description: 'ID da ordem', example: 1 })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'em_andamento' },
        motivoId: { type: 'number', example: 1 },
      },
    },
  })
  async atualizarStatus(
    @Param('id') pedidoId: number,
    @Body('status') status: string,
    @Body('motivoId') motivoId?: number,
    @Request() req?: any,
  ) {
    // Valida o token manualmente (opcional)
    const isValid = await this.authService.validateToken(req.user);
    if (!isValid) {
      throw new UnauthorizedException('Token inválido ou expirado');
    }

    if (status === 'interrompido' && !motivoId) {
      throw new NotFoundException('Motivo de interrupção é obrigatório.');
    }

    return this.ordersService.atualizarStatusPedido(pedidoId, status, motivoId);
  }
}