// src/orders/orders.controller.ts
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
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

@ApiTags('orders')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo pedido' })
  @ApiResponse({
    status: 201,
    description: 'Pedido criado com sucesso.',
  })
  @ApiBody({ type: CreateOrderDto })
  async create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Post('start-tracking')
  @ApiOperation({ summary: 'Iniciar o rastreamento de uma ordem' })
  @ApiResponse({
    status: 201,
    description: 'Rastreamento iniciado com sucesso.',
  })
  @ApiBody({ type: TrackOrderDto })
  async startTracking(@Body() trackOrderDto: TrackOrderDto) {
    return this.ordersService.startTracking(trackOrderDto);
  }

  @Post('end-tracking/:id')
  @ApiOperation({ summary: 'Finalizar o rastreamento de uma ordem' })
  @ApiResponse({
    status: 200,
    description: 'Rastreamento finalizado com sucesso.',
  })
  @ApiParam({ name: 'id', description: 'ID do rastreamento', example: 1 })
  @ApiBody({ type: TrackOrderDto })
  async endTracking(@Param('id') id: number, @Body() trackOrderDto: TrackOrderDto) {
    return this.ordersService.endTracking(id, trackOrderDto);
  }

  @Get('report/:id')
  @ApiOperation({ summary: 'Obter relatório de uma ordem' })
  @ApiResponse({
    status: 200,
    description: 'Relatório retornado com sucesso.',
  })
  @ApiParam({ name: 'id', description: 'ID da ordem', example: 1 })
  async getOrderReport(@Param('id') id: number) {
    return this.ordersService.getOrderReport(id);
  }

  @Post(':id/etapas')
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
  ) {
    return this.ordersService.createEtapa(orderId, nome, funcionarioCode);
  }

  @Post('etapas/:id/iniciar')
  @ApiOperation({ summary: 'Iniciar uma etapa' })
  @ApiResponse({
    status: 200,
    description: 'Etapa iniciada com sucesso.',
  })
  @ApiParam({ name: 'id', description: 'ID da etapa', example: 1 })
  async startEtapa(@Param('id') etapaId: number) {
    return this.ordersService.startEtapa(etapaId);
  }

  @Post('etapas/:id/finalizar')
  @ApiOperation({ summary: 'Finalizar uma etapa' })
  @ApiResponse({
    status: 200,
    description: 'Etapa finalizada com sucesso.',
  })
  @ApiParam({ name: 'id', description: 'ID da etapa', example: 1 })
  async endEtapa(@Param('id') etapaId: number) {
    return this.ordersService.endEtapa(etapaId);
  }

  @Get(':id/etapas')
  @ApiOperation({ summary: 'Listar etapas de uma ordem' })
  @ApiResponse({
    status: 200,
    description: 'Etapas retornadas com sucesso.',
  })
  @ApiParam({ name: 'id', description: 'ID da ordem', example: 1 })
  async listEtapasByOrder(@Param('id') orderId: number) {
    return this.ordersService.listEtapasByOrder(orderId);
  }

  @Post(':id/atualizar-status')
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
        motivoId: { type: 'number', example: 1},
      },
    },
  })
  async atualizarStatus(
    @Param('id') pedidoId: number,
    @Body('status') status: string,
    @Body('motivoId') motivoId?: number,
  ) {
    if (status === 'interrompido' && !motivoId) {
      throw new NotFoundException('Motivo de interrupção é obrigatório.');
    }

    return this.ordersService.atualizarStatusPedido(pedidoId, status, motivoId);
  }
}