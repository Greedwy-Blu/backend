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
  Put,
  BadRequestException,
  InternalServerErrorException,
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
import { CreateMotivoInterrupcaoDto } from './dto/create-motivointerrupcao.dto';
import { UpdateMotivoInterrupcaoDto } from './dto/update-motivointerrupcao.dto';
import { UpdateHistoricoProducaoDto } from './dto/update-historico.dto';
import { CreateHistoricoProducaoDto } from './dto/create-historico.dto';
import { MotivoInterrupcao } from './entities/motivo-interrupcao.entity';
import { EntityRepository } from '@mikro-orm/postgresql';

@ApiTags('orders')
@ApiBearerAuth()
@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard) // Adicionar JwtAuthGuard
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly authService: AuthService, // Injetar o AuthService@InjectRepository(MotivoInterrupcao)
       
       

  ) { }

  @Post()
  @Roles('gestao')
  @ApiOperation({ summary: 'Criar um novo pedido' })
  @ApiResponse({
    status: 201,
    description: 'Pedido criado com sucesso.',
  })
  @ApiBody({ type: CreateOrderDto })
  async create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    console.log('Usuário autenticado:', req.access_token); // Verifique o objeto user


    console.log('tonke usuário:', req.access_token); /// Verifique o objeto user
    return this.ordersService.create(createOrderDto);
  }

  @Post('start-tracking')
  @Roles('gestao')
  @ApiOperation({ summary: 'Iniciar o rastreamento de uma ordem' })
  @ApiResponse({
    status: 201,
    description: 'Rastreamento iniciado com sucesso.',
  })
  @ApiBody({ type: TrackOrderDto })
  async startTracking(@Body() trackOrderDto: TrackOrderDto, @Request() req) {
    // Valida o token manualmente (opcional)


    return this.ordersService.startTracking(trackOrderDto);
  }

  // In your controller
@Post('end-tracking/:id')
async endTracking(
  @Param('id') id: number, 
  @Body() trackOrderDto: TrackOrderDto,
  @Request() req
) {
  // Validate required fields
  if (trackOrderDto.processedQuantity === undefined || trackOrderDto.lostQuantity === undefined) {
    throw new BadRequestException('Both processedQuantity and lostQuantity are required');
  }

  return this.ordersService.endTracking(id, {
    processedQuantity: trackOrderDto.processedQuantity,
    lostQuantity: trackOrderDto.lostQuantity
  });
}

  @Get('report/:id')
  @Roles('gestao')
  @ApiOperation({ summary: 'Obter relatório de uma ordem' })
  @ApiResponse({
    status: 200,
    description: 'Relatório retornado com sucesso.',
  })
  @ApiParam({ name: 'id', description: 'ID da ordem', example: 1 })
  async getOrderReport(@Param('id') id: number, @Request() req) {
    // Valida o token manualmente (opcional)


    return this.ordersService.getOrderReport(id);
  }

  @Post(':id/etapas')
  @Roles('gestao')
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


    return this.ordersService.createEtapa(orderId, nome, funcionarioCode);
  }

  @Post('etapas/:id/iniciar')
  @Roles('gestao')
  @ApiOperation({ summary: 'Iniciar uma etapa' })
  @ApiResponse({
    status: 200,
    description: 'Etapa iniciada com sucesso.',
  })
  @ApiParam({ name: 'id', description: 'ID da etapa', example: 1 })
  async startEtapa(@Param('id') etapaId: number, @Request() req) {
    // Valida o token manualmente (opcional)

    return this.ordersService.startEtapa(etapaId);
  }

  @Post('etapas/:id/finalizar')
  @Roles('gestao')
  @ApiOperation({ summary: 'Finalizar uma etapa' })
  @ApiResponse({
    status: 200,
    description: 'Etapa finalizada com sucesso.',
  })
  @ApiParam({ name: 'id', description: 'ID da etapa', example: 1 })
  async endEtapa(@Param('id') etapaId: number, @Request() req) {
    // Valida o token manualmente (opcional)


    return this.ordersService.endEtapa(etapaId);
  }

  @Get(':id/etapas')
  @Roles('gestao')
  @ApiOperation({ summary: 'Listar etapas de uma ordem' })
  @ApiResponse({
    status: 200,
    description: 'Etapas retornadas com sucesso.',
  })
  @ApiParam({ name: 'id', description: 'ID da ordem', example: 1 })
  async listEtapasByOrder(@Param('id') orderId: number, @Request() req) {
    // Valida o token manualmente (opcional)


    return this.ordersService.listEtapasByOrder(orderId);
  }

  @Put(':id/atualizar-status')
  @Roles('gestao')
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
        status: {
          type: 'string',
          enum: ['aberto', 'em_andamento', 'interrompido', 'finalizado'],
          example: 'em_andamento'
        },
        motivoId: {
          type: 'number',
          example: 1,
          description: 'Obrigatório apenas para status "interrompido"'
        },
      },
      required: ['status']
    },
  })
  async atualizarStatus(
    @Param('id') pedidoId: number,
    @Body() body: { status: string, motivoId?: number },
    @Request() req
  ) {
    // Verificação adicional de permissões se necessário
    return this.ordersService.atualizarStatusPedido(pedidoId, body.status, body.motivoId);
  }

  @Get()
  @Roles('gestao', 'funcionario')
  @ApiOperation({ summary: 'Listar todos os pedidos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de pedidos retornada com sucesso.',
  })
  async findAll(@Request() req) {


    return this.ordersService.findAll();
  }

  @Get('e')
@Roles('gestao', 'funcionario')
@ApiOperation({ summary: 'Criar novo motivo de interrupção' })
@ApiResponse({ status: 201, description: 'Motivo criado com sucesso' })
@ApiResponse({ status: 400, description: 'Dados inválidos' })
async getMotivosInterrupcao(@Request() req) {

 return  this.ordersService.listMotivosInterrupcao()
   
}

  @Get(':id')
  @Roles('gestao', 'funcionario')
  @ApiOperation({ summary: 'Obter detalhes de um pedido por ID' })
  @ApiResponse({
    status: 200,
    description: 'Detalhes do pedido retornados com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Pedido não encontrado.' })
  async findOne(@Param('id') id: number, @Request() req) {

    const order = await this.ordersService.findOne(id);
    if (!order) {
      throw new NotFoundException('Pedido não encontrado.');
    }
    return order;
  }



  @Post('motivos-interrupcao')
  @Roles('gestao')
  @ApiOperation({ summary: 'Criar novo motivo de interrupção' })
  @ApiResponse({ status: 201, description: 'Motivo criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  async createMotivoInterrupcao(@Body() createDto: CreateMotivoInterrupcaoDto) {
    return this.ordersService.createMotivoInterrupcao(createDto);
  }



  @Post('historico-producao')
  @Roles('gestao')
  @ApiOperation({ summary: 'Criar um novo registro no histórico de produção' })
  @ApiResponse({
    status: 201,
    description: 'Registro de histórico de produção criado com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Pedido, funcionário ou motivo de interrupção não encontrado.' })
  @ApiBody({ type: CreateHistoricoProducaoDto })
  async createHistoricoProducao(
    @Body() createHistoricoProducaoDto: CreateHistoricoProducaoDto,
    @Request() req,
  ) {
    // Valida o token manualmente (opcional)


    return this.ordersService.createHistoricoProducao(createHistoricoProducaoDto);
  }

  @Put('historico-producao/:id')
  @Roles('gestao')
  @ApiOperation({ summary: 'Atualizar um registro no histórico de produção' })
  @ApiResponse({
    status: 200,
    description: 'Registro de histórico de produção atualizado com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Registro de histórico de produção, pedido, funcionário ou motivo de interrupção não encontrado.' })
  @ApiParam({ name: 'id', description: 'ID do registro de histórico de produção', example: 1 })
  @ApiBody({ type: UpdateHistoricoProducaoDto })
  async updateHistoricoProducao(
    @Param('id') id: number,
    @Body() updateHistoricoProducaoDto: UpdateHistoricoProducaoDto,
    @Request() req,
  ) {
    // Valida o token manualmente (opcional)


    return this.ordersService.updateHistoricoProducao(id, updateHistoricoProducaoDto);
  }

  @Get(':id/historico-producao')
  @Roles('gestao', 'funcionario')
  @ApiOperation({ summary: 'Listar histórico de produção de um pedido' })
  @ApiResponse({
    status: 200,
    description: 'Histórico de produção retornado com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Pedido não encontrado.' })
  async listHistoricoProducao(@Param('id') id: number, @Request() req) {


    const historico = await this.ordersService.listHistoricoProducao(id);
    if (!historico) {
      throw new NotFoundException('Pedido não encontrado.');
    }
    return historico;
  }



  @Get(':id/rastreamentos')
  @Roles('gestor', 'funcionario')
  @ApiOperation({ summary: 'Listar todos os rastreamentos de uma ordem' })
  @ApiResponse({
    status: 200,
    description: 'Rastreamentos retornados com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Ordem não encontrada.' })
  async listRastreamentosByOrder(@Param('id') orderId: number, @Request() req) {


    const rastreamentos = await this.ordersService.listRastreamentosByOrder(orderId);
    if (!rastreamentos) {
      throw new NotFoundException('Ordem não encontrada.');
    }
    return rastreamentos;
  }
}