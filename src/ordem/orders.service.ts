import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException, Logger } from '@nestjs/common';
import { Order } from './entities/order.entity';
import { OrderTracking } from './entities/order-tracking.entity';
import { Funcionario } from '../colaborador/entities/funcionario.entity';
import { Product } from '../produto/entities/produto.entity';
import { Maquina } from '../maquina/entities/maquina.entity';
import { Etapa } from './entities/etapa.entity';
import { HistoricoProducao } from './entities/historico-producao.entity';
import { MotivoInterrupcao } from './entities/motivo-interrupcao.entity';
import { db } from '../config/database.config';

// DTOs
import { CreateOrderDto } from './dto/create-order.dto';
import { TrackOrderDto } from './dto/track-order.dto';
import { CreateMotivoInterrupcaoDto } from './dto/create-motivointerrupcao.dto';
import { UpdateMotivoInterrupcaoDto } from './dto/update-motivointerrupcao.dto';
import { CreateHistoricoProducaoDto } from './dto/create-historico.dto';
import { UpdateHistoricoProducaoDto } from './dto/update-historico.dto';

// Tipos e constantes
type OrderStatus = 'aberto' | 'em_andamento' | 'interrompido' | 'finalizado';
const VALID_STATUSES: OrderStatus[] = ['aberto', 'em_andamento', 'interrompido', 'finalizado'];

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor() {}

  /**
   * Busca todas as ordens com seus relacionamentos
   */
  async findAll(): Promise<Order[]> {
    return db.selectFrom('order').selectAll().execute();
  }

  /**
   * Busca uma ordem específica pelo ID
   * @throws NotFoundException se a ordem não for encontrada
   */
  async findOne(id: number): Promise<Order> {
    const order = await db.selectFrom('order').selectAll().where('id', '=', id).executeTakeFirst();
    if (!order) {
      throw new NotFoundException(`Pedido com ID ${id} não encontrado.`);
    }
    return order;
  }

  /**
   * Cria uma nova ordem de produção
   * @throws NotFoundException se produto, funcionário ou máquina não forem encontrados
   */
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    // Validações iniciais
    if (!createOrderDto.productCode) {
      throw new BadRequestException('Código do produto é obrigatório.');
    }

    // Busca as entidades relacionadas
    const product = await db.selectFrom('product').selectAll().where('code', '=', createOrderDto.productCode).executeTakeFirst();
    const funcionario = await db.selectFrom('funcionario').selectAll().where('code', '=', createOrderDto.employeeCode).executeTakeFirst();

    if (!product) {
      throw new NotFoundException(`Produto com código ${createOrderDto.productCode} não encontrado.`);
    }

    if (!funcionario) {
      throw new NotFoundException(`Funcionário com código ${createOrderDto.employeeCode} não encontrado.`);
    }

    // Busca máquina se fornecida
    let maquinaId: number | undefined = undefined;
    if (createOrderDto.maquinaCodigo) {
      const maquina = await db.selectFrom('maquina').selectAll().where('codigo', '=', createOrderDto.maquinaCodigo).executeTakeFirst();
      
      if (!maquina) {
        throw new NotFoundException(
          `Máquina com código ${createOrderDto.maquinaCodigo} não encontrada.`
        );
      }
      maquinaId = maquina.id;
    }

    // Cria a ordem
    const newOrder = await db.insertInto('order')
      .values({
        orderNumber: `OP-${Date.now()}`,
        name: `Pedido ${Date.now()}`,
        productId: product.id,
        funcionarioResposavelId: funcionario.id,
        maquinaId: maquinaId,
        lotQuantity: createOrderDto.lotQuantity,
        finalDestination: createOrderDto.finalDestination,
        status: 'aberto',
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return newOrder;
  }

  /**
   * Inicia o rastreamento de uma ordem
   * @throws NotFoundException se ordem ou funcionário não forem encontrados
   */
  async startTracking(trackOrderDto: TrackOrderDto): Promise<OrderTracking> {
    const order = await db.selectFrom('order').selectAll().where('id', '=', trackOrderDto.orderId).executeTakeFirst();
    const funcionario = await db.selectFrom('funcionario').selectAll().where('code', '=', trackOrderDto.employeeCode).executeTakeFirst();

    if (!order) {
      throw new NotFoundException(`Ordem com ID ${trackOrderDto.orderId} não encontrada.`);
    }

    if (!funcionario) {
      throw new NotFoundException(
        `Funcionário com código ${trackOrderDto.employeeCode} não encontrado.`
      );
    }

    const newTracking = await db.insertInto('order_tracking')
      .values({
        orderId: order.id,
        funcionarioId: funcionario.id,
        startTime: new Date(),
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return newTracking;
  }

  /**
   * Finaliza o rastreamento de uma ordem
   * @throws NotFoundException se o rastreamento não for encontrado
   */
  async endTracking(
    trackingId: number, 
    trackOrderDto: Required<Pick<TrackOrderDto, 'processedQuantity' | 'lostQuantity'>>
  ): Promise<OrderTracking> {
    if (trackOrderDto.processedQuantity < 0) {
      throw new BadRequestException('Quantidade processada não pode ser negativa.');
    }

    if (trackOrderDto.lostQuantity < 0) {
      throw new BadRequestException('Quantidade perdida não pode ser negativa.');
    }

    const tracking = await db.selectFrom('order_tracking').selectAll().where('id', '=', trackingId).executeTakeFirst();
    
    if (!tracking) {
      throw new NotFoundException(`Rastreamento com ID ${trackingId} não encontrado.`);
    }

    const updatedTracking = await db.updateTable('order_tracking')
      .set({
        endTime: new Date(),
        lostQuantity: trackOrderDto.lostQuantity,
        processedQuantity: trackOrderDto.processedQuantity,
      })
      .where('id', '=', trackingId)
      .returningAll()
      .executeTakeFirstOrThrow();

    return updatedTracking;
  }

  /**
   * Gera um relatório detalhado de uma ordem
   */
  async getOrderReport(orderId: number) {
    const order = await this.findOne(orderId);
    
    const trackings = await db.selectFrom('order_tracking').selectAll().where('orderId', '=', orderId).execute();
    const totalProcessed = trackings.reduce(
      (sum, tracking) => sum + (tracking.processedQuantity || 0), 0
    );
    const totalLost = trackings.reduce(
      (sum, tracking) => sum + (tracking.lostQuantity || 0), 0
    );
    
    const efficiency = totalProcessed > 0 
      ? ((totalProcessed - totalLost) / totalProcessed) * 100 
      : 0;

    const product = await db.selectFrom('product').selectAll().where('id', '=', order.productId).executeTakeFirst();
    const maquina = order.maquinaId ? await db.selectFrom('maquina').selectAll().where('id', '=', order.maquinaId).executeTakeFirst() : undefined;

    return {
      orderNumber: order.orderNumber,
      product: product?.name,
      lotQuantity: order.lotQuantity,
      finalDestination: order.finalDestination,
      status: order.status,
      maquina: maquina ? {
        codigo: maquina.codigo,
        nome: maquina.nome,
        tipo: maquina.tipo
      } : null,
      efficiency: efficiency.toFixed(2) + '%',
      totalProcessed,
      totalLost,
      trackings: await Promise.all(trackings.map(async (tracking) => {
        const funcionario = await db.selectFrom('funcionario').selectAll().where('id', '=', tracking.funcionarioId).executeTakeFirst();
        return {
          funcionario: funcionario?.nome,
          startTime: tracking.startTime,
          endTime: tracking.endTime,
          duration: tracking.endTime 
            ? this.calculateDuration(tracking.startTime, tracking.endTime)
            : null,
          processedQuantity: tracking.processedQuantity,
          lostQuantity: tracking.lostQuantity,
        };
      })),
    };
  }

  /**
   * Cria uma nova etapa para uma ordem
   * @throws NotFoundException se ordem ou funcionário não forem encontrados
   */
  async createEtapa(
    orderId: number,
    nome: string,
    funcionarioCode: string
  ): Promise<Etapa> {
    const order = await db.selectFrom('order').selectAll().where('id', '=', orderId).executeTakeFirst();
    const funcionario = await db.selectFrom('funcionario').selectAll().where('code', '=', funcionarioCode).executeTakeFirst();

    if (!order) {
      throw new NotFoundException(`Ordem com ID ${orderId} não encontrada.`);
    }

    if (!funcionario) {
      throw new NotFoundException(`Funcionário com código ${funcionarioCode} não encontrado.`);
    }

    const newEtapa = await db.insertInto('etapa')
      .values({
        nome,
        orderId: order.id,
        funcionarioId: funcionario.id,
        inicio: undefined,
        fim: undefined,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return newEtapa;
  }

  /**
   * Inicia uma etapa de produção
   * @throws NotFoundException se a etapa não for encontrada
   */
  async startEtapa(etapaId: number): Promise<Etapa> {
    const etapa = await db.selectFrom('etapa').selectAll().where('id', '=', etapaId).executeTakeFirst();
    
    if (!etapa) {
      throw new NotFoundException(`Etapa com ID ${etapaId} não encontrada.`);
    }

    if (etapa.inicio) {
      throw new BadRequestException('Esta etapa já foi iniciada.');
    }

    const updatedEtapa = await db.updateTable('etapa')
      .set({ inicio: new Date() })
      .where('id', '=', etapaId)
      .returningAll()
      .executeTakeFirstOrThrow();
    
    return updatedEtapa;
  }

  /**
   * Finaliza uma etapa de produção
   * @throws NotFoundException se a etapa não for encontrada
   */
  async endEtapa(etapaId: number): Promise<Etapa> {
    const etapa = await db.selectFrom('etapa').selectAll().where('id', '=', etapaId).executeTakeFirst();
    
    if (!etapa) {
      throw new NotFoundException(`Etapa com ID ${etapaId} não encontrada.`);
    }

    if (!etapa.inicio) {
      throw new BadRequestException('Esta etapa ainda não foi iniciada.');
    }

    if (etapa.fim) {
      throw new BadRequestException('Esta etapa já foi finalizada.');
    }

    const updatedEtapa = await db.updateTable('etapa')
      .set({ fim: new Date() })
      .where('id', '=', etapaId)
      .returningAll()
      .executeTakeFirstOrThrow();
   
    return updatedEtapa;
  }

  /**
   * Lista etapas de uma ordem
   * @throws NotFoundException se a ordem não for encontrada
   */
  async listEtapasByOrder(orderId: number): Promise<Etapa[]> {
    const order = await db.selectFrom('order').selectAll().where('id', '=', orderId).executeTakeFirst();
    
    if (!order) {
      throw new NotFoundException(`Ordem com ID ${orderId} não encontrada.`);
    }

    return db.selectFrom('etapa').selectAll().where('orderId', '=', orderId).execute();
  }

  /**
   * Atualiza o status de um pedido com validações
   * @throws NotFoundException se pedido ou motivo não forem encontrados
   * @throws BadRequestException para transições de status inválidas
   */
  async atualizarStatusPedido(
    pedidoId: number, 
    status: string,
    motivoId?: number
  ): Promise<Order> {
    const statusValidado = this.validarStatus(status);

    const pedido = await db.selectFrom('order').selectAll().where('id', '=', pedidoId).executeTakeFirst();
    
    if (!pedido) {
      throw new NotFoundException(`Pedido com ID ${pedidoId} não encontrado.`);
    }

    const etapas = await db.selectFrom('etapa').selectAll().where('orderId', '=', pedidoId).execute();

    this.validateStatusTransition(
      pedido.status as OrderStatus,
      statusValidado,
      motivoId,
      etapas
    );

    if (statusValidado === 'interrompido') {
      if (motivoId === undefined) {
        throw new BadRequestException('Motivo de interrupção é obrigatório.');
      }

      const motivo = await db.selectFrom('motivo_interrupcao').selectAll().where('id', '=', motivoId).executeTakeFirst();
      if (!motivo) {
        throw new NotFoundException(`Motivo com ID ${motivoId} não encontrado.`);
      }

      const funcionarioResposavel = await db.selectFrom('funcionario').selectAll().where('id', '=', pedido.funcionarioResposavelId).executeTakeFirstOrThrow();

      await this.registrarHistorico(
        pedido,
        funcionarioResposavel,
        'Pedido interrompido',
        `Motivo: ${motivo.descricao}`,
        motivo
      );
    }

    const updatedPedido = await db.updateTable('order')
      .set({
        status: statusValidado,
        updated_at: new Date(),
      })
      .where('id', '=', pedidoId)
      .returningAll()
      .executeTakeFirstOrThrow();

    return updatedPedido;
  }

  /**
   * Valida a transição de status
   */
  private validateStatusTransition(
    currentStatus: OrderStatus,
    newStatus: OrderStatus,
    motivoId: number | undefined,
    etapas: Etapa[]
  ): void {
    if (currentStatus === 'finalizado') {
      throw new BadRequestException('Pedido finalizado não pode ter seu status alterado.');
    }

    if (newStatus === 'interrompido' && motivoId === undefined) {
      throw new BadRequestException('Motivo de interrupção é obrigatório.');
    }

    if (newStatus === 'em_andamento' && currentStatus === 'aberto') {
      const etapasObrigatorias = ['Preparação', 'Produção'];
      const etapasCriadas = etapas.map(e => e.nome);
      
      const faltantes = etapasObrigatorias.filter(e => !etapasCriadas.includes(e));
      if (faltantes.length > 0) {
        throw new BadRequestException(
          `Etapas obrigatórias faltantes: ${faltantes.join(', ')}`
        );
      }
    }
  }

  /**
   * Registra um evento no histórico de produção
   */
  private async registrarHistorico(
    pedido: Order,
    funcionario: Funcionario,
    acao: string,
    detalhes: string,
    motivo?: MotivoInterrupcao
  ): Promise<HistoricoProducao> {
    const newHistorico = await db.insertInto('historico_producao')
      .values({
        orderId: pedido.id,
        funcionarioId: funcionario.id,
        acao,
        detalhes,
        motivoInterrupcaoId: motivo?.id,
        data_hora: new Date(),
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return newHistorico;
  }

  /**
   * Lista todos os motivos de interrupção
   */
  async listMotivosInterrupcao(): Promise<MotivoInterrupcao[]> {
    return db.selectFrom('motivo_interrupcao').selectAll().execute();
  }

  /**
   * Cria um novo motivo de interrupção
   */
  async createMotivoInterrupcao(
    createMotivoInterrupcaoDto: CreateMotivoInterrupcaoDto
  ): Promise<MotivoInterrupcao> {
    const newMotivo = await db.insertInto('motivo_interrupcao')
      .values(createMotivoInterrupcaoDto)
      .returningAll()
      .executeTakeFirstOrThrow();
    return newMotivo;
  }

  /**
   * Cria um registro no histórico de produção
   */
  async createHistoricoProducao(
    createHistoricoProducaoDto: CreateHistoricoProducaoDto
  ): Promise<HistoricoProducao> {
    const pedido = await db.selectFrom('order').selectAll().where('id', '=', createHistoricoProducaoDto.pedidoId).executeTakeFirst();
    const funcionario = await db.selectFrom('funcionario').selectAll().where('id', '=', createHistoricoProducaoDto.funcionarioId).executeTakeFirst();

    if (!pedido) {
      throw new NotFoundException(
        `Pedido com ID ${createHistoricoProducaoDto.pedidoId} não encontrado.`
      );
    }

    if (!funcionario) {
      throw new NotFoundException(
        `Funcionário com ID ${createHistoricoProducaoDto.funcionarioId} não encontrado.`
      );
    }

    const newHistorico = await db.insertInto('historico_producao')
      .values({
        orderId: pedido.id,
        funcionarioId: funcionario.id,
        acao: createHistoricoProducaoDto.acao,
        detalhes: createHistoricoProducaoDto.detalhes,
        motivoInterrupcaoId: createHistoricoProducaoDto.motivoInterrupcaoId,
        data_hora: new Date(),
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return newHistorico;
  }

  /**
   * Atualiza um motivo de interrupção existente
   */
  async updateMotivoInterrupcao(
    id: number,
    updateMotivoInterrupcaoDto: UpdateMotivoInterrupcaoDto
  ): Promise<MotivoInterrupcao> {
    const motivo = await db.selectFrom('motivo_interrupcao').selectAll().where('id', '=', id).executeTakeFirst();
    if (!motivo) {
      throw new NotFoundException(`Motivo de interrupção com ID ${id} não encontrado.`);
    }

    const updatedMotivo = await db.updateTable('motivo_interrupcao')
      .set(updateMotivoInterrupcaoDto)
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirstOrThrow();
    return updatedMotivo;
  }

  /**
   * Remove um motivo de interrupção
   */
  async removeMotivoInterrupcao(id: number): Promise<void> {
    const { numDeletedRows } = await db.deleteFrom('motivo_interrupcao').where('id', '=', id).executeTakeFirstOrThrow();
    if (Number(numDeletedRows) === 0) {
      throw new NotFoundException(`Motivo de interrupção com ID ${id} não encontrado.`);
    }
  }

  /**
   * Busca um motivo de interrupção pelo ID
   */
  async findMotivoInterrupcaoById(id: number): Promise<MotivoInterrupcao> {
    const motivo = await db.selectFrom('motivo_interrupcao').selectAll().where('id', '=', id).executeTakeFirst();
    if (!motivo) {
      throw new NotFoundException(`Motivo de interrupção com ID ${id} não encontrado.`);
    }
    return motivo;
  }

  /**
   * Busca um histórico de produção pelo ID
   */
  async findHistoricoProducaoById(id: number): Promise<HistoricoProducao> {
    const historico = await db.selectFrom('historico_producao').selectAll().where('id', '=', id).executeTakeFirst();
    if (!historico) {
      throw new NotFoundException(`Histórico de produção com ID ${id} não encontrado.`);
    }
    return historico;
  }

  /**
   * Atualiza um histórico de produção existente
   */
  async updateHistoricoProducao(
    id: number,
    updateHistoricoProducaoDto: UpdateHistoricoProducaoDto
  ): Promise<HistoricoProducao> {
    const historico = await db.selectFrom('historico_producao').selectAll().where('id', '=', id).executeTakeFirst();
    if (!historico) {
      throw new NotFoundException(`Histórico de produção com ID ${id} não encontrado.`);
    }

    const updatedHistorico = await db.updateTable('historico_producao')
      .set(updateHistoricoProducaoDto)
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirstOrThrow();
    return updatedHistorico;
  }

  /**
   * Remove um histórico de produção
   */
  async removeHistoricoProducao(id: number): Promise<void> {
    const { numDeletedRows } = await db.deleteFrom('historico_producao').where('id', '=', id).executeTakeFirstOrThrow();
    if (Number(numDeletedRows) === 0) {
      throw new NotFoundException(`Histórico de produção com ID ${id} não encontrado.`);
    }
  }

  /**
   * Lista todos os rastreamentos de uma ordem
   */
  async listRastreamentosByOrder(orderId: number): Promise<OrderTracking[]> {
    const order = await db.selectFrom('order').selectAll().where('id', '=', orderId).executeTakeFirst();
    if (!order) {
      throw new NotFoundException(`Ordem com ID ${orderId} não encontrada.`);
    }
    return db.selectFrom('order_tracking').selectAll().where('orderId', '=', orderId).execute();
  }

  /**
   * Valida o status fornecido
   */
  private validarStatus(status: string): OrderStatus {
    if (!VALID_STATUSES.includes(status as OrderStatus)) {
      throw new BadRequestException(`Status inválido: ${status}. Status permitidos: ${VALID_STATUSES.join(', ')}`);
    }
    return status as OrderStatus;
  }

  /**
   * Calcula a duração entre duas datas em minutos
   */
  private calculateDuration(start: Date, end: Date): number {
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60));
  }
}


