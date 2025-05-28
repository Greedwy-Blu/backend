import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException,Logger } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, Loaded } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';
import { Order } from './entities/order.entity';
import { OrderTracking } from './entities/order-tracking.entity';
import { Funcionario } from '../colaborador/entities/funcionario.entity';
import { Product } from '../produto/entities/produto.entity';
import { Maquina } from '../maquina/entities/maquina.entity';
import { Etapa } from './entities/etapa.entity';
import { HistoricoProducao } from './entities/historico-producao.entity';
import { MotivoInterrupcao } from './entities/motivo-interrupcao.entity';

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
type PopulatedOrderFields = 'product' | 'funcionarioResposavel' | 'etapas' | 'trackings' | 'maquina';

@Injectable()
export class OrdersService {
    private readonly logger = new Logger(OrdersService.name);


  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: EntityRepository<Order>,
    @InjectRepository(OrderTracking)
    private readonly orderTrackingRepository: EntityRepository<OrderTracking>,
    @InjectRepository(Funcionario)
    private readonly funcionariosRepository: EntityRepository<Funcionario>,
    @InjectRepository(Product)
    private readonly productRepository: EntityRepository<Product>,
    @InjectRepository(Etapa)
    private readonly etapaRepository: EntityRepository<Etapa>,
    @InjectRepository(MotivoInterrupcao)
    private readonly motivoRepository: EntityRepository<MotivoInterrupcao>,
    @InjectRepository(HistoricoProducao)
    private readonly historicoProducaoRepository: EntityRepository<HistoricoProducao>,
    @InjectRepository(Maquina)
    private readonly maquinaRepository: EntityRepository<Maquina>,
    private readonly em: EntityManager,
  ) {}

  /**
   * Busca todas as ordens com seus relacionamentos
   */
  async findAll(): Promise<Loaded<Order, 'product' | 'funcionarioResposavel' | 'maquina'  >[]> {
    return this.orderRepository.findAll({ 
      populate: ['product', 'funcionarioResposavel', 'maquina', ] 
    });
  }
  
  /**
   * Busca uma ordem específica pelo ID
   * @throws NotFoundException se a ordem não for encontrada
   */
  async findOne(id: number): Promise<Loaded<Order, PopulatedOrderFields>> {
  const populateFields: PopulatedOrderFields[] = [
    'product',
    'funcionarioResposavel',
    'etapas',
    'trackings',
    'maquina'
  ];
  
  const order = await this.orderRepository.findOne(id, {
    populate: populateFields
  });
  
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
    const [product, funcionario] = await Promise.all([
      this.productRepository.findOne({ code: createOrderDto.productCode }),
      this.funcionariosRepository.findOne({ code: createOrderDto.employeeCode }),
    ]);

    if (!product) {
      throw new NotFoundException(`Produto com código ${createOrderDto.productCode} não encontrado.`);
    }

    if (!funcionario) {
      throw new NotFoundException(`Funcionário com código ${createOrderDto.employeeCode} não encontrado.`);
    }

    // Busca máquina se fornecida
    let maquina: Maquina | null = null;
    if (createOrderDto.maquinaCodigo) {
      maquina = await this.maquinaRepository.findOne({ 
        codigo: createOrderDto.maquinaCodigo 
      });
      
      if (!maquina) {
        throw new NotFoundException(
          `Máquina com código ${createOrderDto.maquinaCodigo} não encontrada.`
        );
      }
    }

    // Cria a ordem
    const order = this.orderRepository.create({
      orderNumber: `OP-${Date.now()}`,
      name: `Pedido ${Date.now()}`,
      product,
      funcionarioResposavel: funcionario,
      maquina,
      lotQuantity: createOrderDto.lotQuantity,
      finalDestination: createOrderDto.finalDestination,
      status: 'aberto',
      created_at: new Date(),
      updated_at: new Date(),
    });

    await this.em.persistAndFlush(order);
    return order;
  }

  /**
   * Inicia o rastreamento de uma ordem
   * @throws NotFoundException se ordem ou funcionário não forem encontrados
   */
  async startTracking(trackOrderDto: TrackOrderDto): Promise<OrderTracking> {
    const [order, funcionario] = await Promise.all([
      this.orderRepository.findOne(trackOrderDto.orderId),
      this.funcionariosRepository.findOne({ code: trackOrderDto.employeeCode }),
    ]);

    if (!order) {
      throw new NotFoundException(`Ordem com ID ${trackOrderDto.orderId} não encontrada.`);
    }

    if (!funcionario) {
      throw new NotFoundException(
        `Funcionário com código ${trackOrderDto.employeeCode} não encontrado.`
      );
    }

    const tracking = this.orderTrackingRepository.create({
      order,
      funcionarios: funcionario,
      startTime: new Date(),
    });

    await this.em.persistAndFlush(tracking);
    return tracking;
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

    const tracking = await this.orderTrackingRepository.findOne(trackingId);
    
    if (!tracking) {
      throw new NotFoundException(`Rastreamento com ID ${trackingId} não encontrado.`);
    }

    tracking.endTime = new Date();
    tracking.lostQuantity = trackOrderDto.lostQuantity;
    tracking.processedQuantity = trackOrderDto.processedQuantity;

    await this.em.flush();
    return tracking;
  }

  /**
   * Gera um relatório detalhado de uma ordem
   */
  async getOrderReport(orderId: number) {
    const order = await this.findOne(orderId);
    
    // Cálculo de métricas
    const trackings = order.trackings.getItems();
    const totalProcessed = trackings.reduce(
      (sum, tracking) => sum + (tracking.processedQuantity || 0), 0
    );
    const totalLost = trackings.reduce(
      (sum, tracking) => sum + (tracking.lostQuantity || 0), 0
    );
    
    const efficiency = totalProcessed > 0 
      ? ((totalProcessed - totalLost) / totalProcessed) * 100 
      : 0;

    return {
      orderNumber: order.orderNumber,
      product: order.product.name,
      lotQuantity: order.lotQuantity,
      finalDestination: order.finalDestination,
      status: order.status,
      maquina: order.maquina ? {
        codigo: order.maquina.codigo,
        nome: order.maquina.nome,
        tipo: order.maquina.tipo
      } : null,
      efficiency: efficiency.toFixed(2) + '%',
      totalProcessed,
      totalLost,
      trackings: trackings.map((tracking) => ({
        funcionario: tracking.funcionarios.nome,
        startTime: tracking.startTime,
        endTime: tracking.endTime,
        duration: tracking.endTime 
          ? this.calculateDuration(tracking.startTime, tracking.endTime)
          : null,
        processedQuantity: tracking.processedQuantity,
        lostQuantity: tracking.lostQuantity,
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
    const [order, funcionario] = await Promise.all([
      this.orderRepository.findOne(orderId),
      this.funcionariosRepository.findOne({ code: funcionarioCode }),
    ]);

    if (!order) {
      throw new NotFoundException(`Ordem com ID ${orderId} não encontrada.`);
    }

    if (!funcionario) {
      throw new NotFoundException(`Funcionário com código ${funcionarioCode} não encontrado.`);
    }

    const etapa = this.etapaRepository.create({
      nome,
      order,
      funcionario,
     inicio: null,
     fim: null,
    });

    await this.em.persistAndFlush(etapa);
    return etapa;
  }


  /**
   * Inicia uma etapa de produção
   * @throws NotFoundException se a etapa não for encontrada
   */
  async startEtapa(etapaId: number): Promise<Etapa> {
    const etapa = await this.etapaRepository.findOne(etapaId);
    
    if (!etapa) {
      throw new NotFoundException(`Etapa com ID ${etapaId} não encontrada.`);
    }

    if (etapa.inicio) {
      throw new BadRequestException('Esta etapa já foi iniciada.');
    }

    etapa.inicio = new Date();
   
    
    await this.em.flush();
    return etapa;
  }

  /**
   * Finaliza uma etapa de produção
   * @throws NotFoundException se a etapa não for encontrada
   */
  async endEtapa(etapaId: number): Promise<Etapa> {
    const etapa = await this.etapaRepository.findOne(etapaId);
    
    if (!etapa) {
      throw new NotFoundException(`Etapa com ID ${etapaId} não encontrada.`);
    }

    if (!etapa.inicio) {
      throw new BadRequestException('Esta etapa ainda não foi iniciada.');
    }

    if (etapa.fim) {
      throw new BadRequestException('Esta etapa já foi finalizada.');
    }

    etapa.fim = new Date();
   
    
    
    await this.em.flush();
    return etapa;
  }

  /**
   * Lista etapas de uma ordem
   * @throws NotFoundException se a ordem não for encontrada
   */
  async listEtapasByOrder(orderId: number): Promise<Etapa[]> {
    const order = await this.orderRepository.findOne(orderId, { populate: ['etapas'] });
    
    if (!order) {
      throw new NotFoundException(`Ordem com ID ${orderId} não encontrada.`);
    }

    return order.etapas.getItems();
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
  // First validate the input status
  const statusValidado = this.validarStatus(status);

  // Then load the order with necessary relations
  const pedido = await this.orderRepository.findOne(pedidoId, { 
    populate: ['funcionarioResposavel', 'etapas', 'trackings'] 
  });
  
  if (!pedido) {
    throw new NotFoundException(`Pedido com ID ${pedidoId} não encontrado.`);
  }

  // TypeScript now knows both status values are OrderStatus
  this.validateStatusTransition(
    pedido.status as OrderStatus,
    statusValidado,
    motivoId,
    pedido.etapas.getItems()
  );

  if (statusValidado === 'interrompido') {
    if (motivoId === undefined) {
      throw new BadRequestException('Motivo de interrupção é obrigatório.');
    }

    const motivo = await this.motivoRepository.findOne({ id: motivoId });
    if (!motivo) {
      throw new NotFoundException(`Motivo com ID ${motivoId} não encontrado.`);
    }

    await this.registrarHistorico(
      pedido,
      pedido.funcionarioResposavel,
      'Pedido interrompido',
      `Motivo: ${motivo.descricao}`,
      motivo
    );
  }

  pedido.status = statusValidado;
  pedido.updated_at = new Date();

  await this.em.flush();
  return pedido;
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
    // Pedidos finalizados não podem ser alterados
    if (currentStatus === 'finalizado') {
      throw new BadRequestException('Pedido finalizado não pode ter seu status alterado.');
    }

    // Validação para status 'interrompido'
    if (newStatus === 'interrompido' && motivoId === undefined) {
      throw new BadRequestException('Motivo de interrupção é obrigatório.');
    }

    // Validação para transição para 'em_andamento'
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
    const historico = this.historicoProducaoRepository.create({
      pedido,
      funcionario,
      acao,
      detalhes,
      motivo_interrupcao: motivo,
      data_hora: new Date(),
    });

    await this.em.persistAndFlush(historico);
    return historico;
  }

  /**
   * Lista todos os motivos de interrupção
   */
  async listMotivosInterrupcao(): Promise<Loaded<MotivoInterrupcao>[]> {
      const connection = this.em.getConnection();
  const result = await connection.execute('SELECT * FROM motivo_interrupcao');
  
  // Converter os resultados brutos para instâncias da entidade
  return result.map(item => this.em.map(MotivoInterrupcao, item));
  }
  /**
   * Cria um novo motivo de interrupção
   */
  async createMotivoInterrupcao(
    createMotivoInterrupcaoDto: CreateMotivoInterrupcaoDto
  ): Promise<MotivoInterrupcao> {
    const motivo = this.motivoRepository.create(createMotivoInterrupcaoDto);
    await this.em.persistAndFlush(motivo);
    return motivo;
  }

  /**
   * Cria um registro no histórico de produção
   */
  async createHistoricoProducao(
    createHistoricoProducaoDto: CreateHistoricoProducaoDto
  ): Promise<HistoricoProducao> {
    const [pedido, funcionario] = await Promise.all([
      this.orderRepository.findOne(createHistoricoProducaoDto.pedidoId),
      this.funcionariosRepository.findOne(createHistoricoProducaoDto.funcionarioId),
    ]);

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

    // Busca motivo se fornecido
    let motivo: MotivoInterrupcao | undefined = undefined;
    if (createHistoricoProducaoDto.motivoInterrupcaoId !== undefined) {
      const motivoEncontrado = await this.motivoRepository.findOne({ 
        id: createHistoricoProducaoDto.motivoInterrupcaoId 
      });
      
      if (!motivoEncontrado) {
        throw new NotFoundException(
          `Motivo com ID ${createHistoricoProducaoDto.motivoInterrupcaoId} não encontrado.`
        );
      }
      motivo = motivoEncontrado;
    }

    const historico = this.historicoProducaoRepository.create({
      pedido,
      funcionario,
      acao: createHistoricoProducaoDto.acao,
      detalhes: createHistoricoProducaoDto.detalhes,
      motivo_interrupcao: motivo,
      data_hora: new Date(),
    });

    await this.em.persistAndFlush(historico);
    return historico;
  }

  /**
   * Atualiza um registro no histórico de produção
   */
  async updateHistoricoProducao(
    id: number,
    updateHistoricoProducaoDto: UpdateHistoricoProducaoDto,
  ): Promise<HistoricoProducao> {
    const historico = await this.historicoProducaoRepository.findOne(id);
    if (!historico) {
      throw new NotFoundException(`Histórico com ID ${id} não encontrado.`);
    }

    // Atualizações condicionais
    if (updateHistoricoProducaoDto.pedidoId !== undefined) {
      const pedido = await this.orderRepository.findOne(updateHistoricoProducaoDto.pedidoId);
      if (!pedido) {
        throw new NotFoundException(
          `Pedido com ID ${updateHistoricoProducaoDto.pedidoId} não encontrado.`
        );
      }
      historico.pedido = pedido;
    }

    if (updateHistoricoProducaoDto.funcionarioId !== undefined) {
      const funcionario = await this.funcionariosRepository.findOne(
        updateHistoricoProducaoDto.funcionarioId
      );
      if (!funcionario) {
        throw new NotFoundException(
          `Funcionário com ID ${updateHistoricoProducaoDto.funcionarioId} não encontrado.`
        );
      }
      historico.funcionario = funcionario;
    }

    if (updateHistoricoProducaoDto.acao !== undefined) {
      historico.acao = updateHistoricoProducaoDto.acao;
    }

    if (updateHistoricoProducaoDto.detalhes !== undefined) {
      historico.detalhes = updateHistoricoProducaoDto.detalhes;
    }

    // Atualização especial para motivo
    if (updateHistoricoProducaoDto.motivoInterrupcaoId !== undefined) {
      if (updateHistoricoProducaoDto.motivoInterrupcaoId === null) {
        historico.motivo_interrupcao = undefined;
      } else {
        const motivo = await this.motivoRepository.findOne(
          updateHistoricoProducaoDto.motivoInterrupcaoId
        );
        if (!motivo) {
          throw new NotFoundException(
            `Motivo com ID ${updateHistoricoProducaoDto.motivoInterrupcaoId} não encontrado.`
          );
        }
        historico.motivo_interrupcao = motivo;
      }
    }

    if (updateHistoricoProducaoDto.dataHora !== undefined) {
      historico.data_hora = updateHistoricoProducaoDto.dataHora;
    }

    await this.em.flush();
    return historico;
  }

  /**
   * Lista o histórico de produção de uma ordem
   */
  async listHistoricoProducao(orderId: number): Promise<HistoricoProducao[]> {
    const historico = await this.historicoProducaoRepository.find(
      { pedido: orderId },
      { populate: ['funcionario', 'motivo_interrupcao'] }
    );
    
    if (!historico || historico.length === 0) {
      throw new NotFoundException(
        `Nenhum histórico encontrado para a ordem com ID ${orderId}.`
      );
    }
    
    return historico;
  }

  /**
   * Lista rastreamentos de uma ordem
   */
  async listRastreamentosByOrder(orderId: number): Promise<OrderTracking[]> {
    const rastreamentos = await this.orderTrackingRepository.find(
      { order: orderId },
      { populate: ['funcionarios'] }
    );
    
    if (!rastreamentos || rastreamentos.length === 0) {
      throw new NotFoundException(
        `Nenhum rastreamento encontrado para a ordem com ID ${orderId}.`
      );
    }
    
    return rastreamentos;
  }

  /**
   * Atualiza a máquina associada a uma ordem
   */
  async atualizarMaquina(orderId: number, maquinaCodigo: string): Promise<Order> {
    const order = await this.orderRepository.findOne(orderId);
    if (!order) {
      throw new NotFoundException(`Ordem com ID ${orderId} não encontrada.`);
    }

    if (maquinaCodigo) {
      const maquina = await this.maquinaRepository.findOne({ codigo: maquinaCodigo });
      if (!maquina) {
        throw new NotFoundException(`Máquina com código ${maquinaCodigo} não encontrada.`);
      }
      order.maquina = maquina;
    } else {
      order.maquina = undefined;
    }

    order.updated_at = new Date();
    await this.em.flush();
    return order;
  }

  /**
   * Métodos auxiliares
   */
  private calculateDuration(start: Date, end: Date): string {
    const diff = end.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  }

  private validarStatus(status: string): OrderStatus {
    if (!VALID_STATUSES.includes(status as OrderStatus)) {
      throw new BadRequestException(
        `Status inválido. Os status permitidos são: ${VALID_STATUSES.join(', ')}`
      );
    }
    return status as OrderStatus;
  }
}