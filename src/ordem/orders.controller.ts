import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { TrackOrderDto } from './dto/track-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Post('start-tracking')
  async startTracking(@Body() trackOrderDto: TrackOrderDto) {
    return this.ordersService.startTracking(trackOrderDto);
  }

  @Post('end-tracking/:id')
  async endTracking(@Param('id') id: number, @Body() trackOrderDto: TrackOrderDto) {
    return this.ordersService.endTracking(id, trackOrderDto);
  }

  @Get('report/:id')
  async getOrderReport(@Param('id') id: number) {
    return this.ordersService.getOrderReport(id);
  }

  @Post(':id/etapas')
  async createEtapa(
    @Param('id') orderId: number,
    @Body('nome') nome: string,
    @Body('funcionarioCode') funcionarioCode: string,
  ) {
    return this.ordersService.createEtapa(orderId, nome, funcionarioCode);
  }

  @Post('etapas/:id/iniciar')
  async startEtapa(@Param('id') etapaId: number) {
    return this.ordersService.startEtapa(etapaId);
  }

  @Post('etapas/:id/finalizar')
  async endEtapa(@Param('id') etapaId: number) {
    return this.ordersService.endEtapa(etapaId);
  }

  @Get(':id/etapas')
  async listEtapasByOrder(@Param('id') orderId: number) {
    return this.ordersService.listEtapasByOrder(orderId);
  }

  @Post(':id/atualizar-status')
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