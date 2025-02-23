// src/orders/orders.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql'; // Importe o EntityManager
import { Order } from './entities/order.entity';
import { OrderTracking } from './entities/order-tracking.entity';
import { Funcionario } from '../colaborador/entities/funcionario.entity';
import { Product } from '../produto/entities/produto.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { TrackOrderDto } from './dto/track-order.dto';
import { Etapa } from './entities/etapa.entity';
import { HistoricoProducao } from './entities/historico-producao.entity';
import { MotivoInterrupcao } from './entities/motivo-interrupcao.entity';

@Injectable()
export class OrdersService {
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
    private readonly em: EntityManager, // Injete o EntityManager
  ) {}

  // Cria um novo pedido
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const product = await this.productRepository.findOne({ code: createOrderDto.productCode });
    if (!product) {
      throw new NotFoundException('Produto não encontrado.');
    }
  
    const funcionario = await this.funcionariosRepository.findOne({ code: createOrderDto.employeeCode });
    if (!funcionario) {
      throw new NotFoundException('Funcionário não encontrado.');
    }
  
    // Cria o pedido com todos os campos obrigatórios
    const order = this.orderRepository.create({
      orderNumber: `OP-${Date.now()}`, // Gera um número de ordem único
      name: `Pedido ${Date.now()}`, // Nome do pedido (pode ser personalizado)
      product, // Produto associado
      funcionarioResposavel: funcionario, // Funcionário responsável
      lotQuantity: createOrderDto.lotQuantity, // Quantidade do lote
      finalDestination: createOrderDto.finalDestination, // Destino final
      status: 'aberto', // Status inicial do pedido
      created_at: new Date(), // Data de criação
      updated_at: new Date(), // Data de atualização
    });
  
    await this.em.persistAndFlush(order); // Persiste o pedido no banco de dados
    return order;
  }
  // Inicia o rastreamento de uma ordem
  async startTracking(trackOrderDto: TrackOrderDto): Promise<OrderTracking> {
    const order = await this.orderRepository.findOne(trackOrderDto.orderId);
    if (!order) {
      throw new NotFoundException('Ordem não encontrada.');
    }

    const funcionario = await this.funcionariosRepository.findOne({ code: trackOrderDto.employeeCode });
    if (!funcionario) {
      throw new NotFoundException('Funcionário não encontrado.');
    }

    const tracking = this.orderTrackingRepository.create({
      order,
      funcionarios: funcionario,
      startTime: new Date(), // Define a hora de início como o momento atual
    });

    await this.em.persistAndFlush(tracking); // Persiste o rastreamento no banco de dados
    return tracking;
  }

  // Finaliza o rastreamento de uma ordem
  async endTracking(trackingId: number, trackOrderDto: TrackOrderDto): Promise<OrderTracking> {
    const tracking = await this.orderTrackingRepository.findOne(trackingId);
    if (!tracking) {
      throw new NotFoundException('Rastreamento não encontrado.');
    }

    tracking.endTime = new Date(); // Define a hora de término como o momento atual
    tracking.lostQuantity = trackOrderDto.lostQuantity; // Atualiza a quantidade de peças perdidas
    tracking.processedQuantity = trackOrderDto.processedQuantity; // Atualiza a quantidade de peças processadas

    await this.em.flush(); // Sincroniza as alterações no banco de dados
    return tracking;
  }

  // Gera um relatório de uma ordem
  async getOrderReport(orderId: number) {
    const order = await this.orderRepository.findOne(orderId, { populate: ['trackings'] });
    if (!order) {
      throw new NotFoundException('Ordem não encontrada.');
    }

    // Calcula a eficiência do pedido
    const totalProcessed = order.trackings.getItems().reduce((sum, tracking) => sum + (tracking.processedQuantity || 0), 0);
    const totalLost = order.trackings.getItems().reduce((sum, tracking) => sum + (tracking.lostQuantity || 0), 0);
    const efficiency = ((totalProcessed - totalLost) / totalProcessed) * 100;

    return {
      orderNumber: order.orderNumber,
      product: order.product.name,
      lotQuantity: order.lotQuantity,
      finalDestination: order.finalDestination,
      efficiency: efficiency.toFixed(2) + '%', // Eficiência em porcentagem
      trackings: order.trackings.getItems().map((tracking) => ({
        funcionarios: tracking.funcionarios.nome,
        startTime: tracking.startTime,
        endTime: tracking.endTime,
        processedQuantity: tracking.processedQuantity,
        lostQuantity: tracking.lostQuantity,
      })),
    };
  }

  // Cria uma nova etapa para uma ordem
  async createEtapa(orderId: number, nome: string, funcionarioCode: string): Promise<Etapa> {
    const order = await this.orderRepository.findOne(orderId);
    if (!order) {
      throw new NotFoundException('Ordem não encontrada.');
    }

    const funcionario = await this.funcionariosRepository.findOne({ code: funcionarioCode });
    if (!funcionario) {
      throw new NotFoundException('Funcionário não encontrado.');
    }

    const etapa = this.etapaRepository.create({
      nome,
      order,
      funcionario,
    });

    await this.em.persistAndFlush(etapa); // Persiste a etapa no banco de dados
    return etapa;
  }

  // Inicia uma etapa
  async startEtapa(etapaId: number): Promise<Etapa> {
    const etapa = await this.etapaRepository.findOne(etapaId);
    if (!etapa) {
      throw new NotFoundException('Etapa não encontrada.');
    }

    etapa.inicio = new Date(); // Define a hora de início como o momento atual
    await this.em.flush(); // Sincroniza as alterações no banco de dados
    return etapa;
  }

  // Finaliza uma etapa
  async endEtapa(etapaId: number): Promise<Etapa> {
    const etapa = await this.etapaRepository.findOne(etapaId);
    if (!etapa) {
      throw new NotFoundException('Etapa não encontrada.');
    }

    etapa.fim = new Date(); // Define a hora de término como o momento atual
    await this.em.flush(); // Sincroniza as alterações no banco de dados
    return etapa;
  }

  // Lista todas as etapas de uma ordem
  async listEtapasByOrder(orderId: number): Promise<Etapa[]> {
    const order = await this.orderRepository.findOne(orderId, { populate: ['etapas'] });
    if (!order) {
      throw new NotFoundException('Ordem não encontrada.');
    }

    return order.etapas.getItems(); // Retorna as etapas associadas à ordem
  }

  // Atualiza o status de um pedido
  async atualizarStatusPedido(pedidoId: number, status: string, motivoId?: number): Promise<Order> {
    // Busca o pedido pelo ID
    const pedido = await this.orderRepository.findOne(pedidoId, { populate: ['funcionarioResposavel'] });
    if (!pedido) {
      throw new NotFoundException('Pedido não encontrado.');
    }
  
    // Verifica se o status é válido
    const statusValidos = ['aberto', 'em_andamento', 'interrompido', 'finalizado'];
    if (!statusValidos.includes(status)) {
      throw new NotFoundException('Status inválido.');
    }
  
    // Atualiza o status do pedido
    pedido.status = status;
  
    // Se o status for "interrompido", registra o motivo no histórico
    if (status === 'interrompido') {
      if (!motivoId) {
        throw new NotFoundException('Motivo de interrupção é obrigatório.');
      }
  
      const motivo = await this.motivoRepository.findOne(motivoId);
      if (!motivo) {
        throw new NotFoundException('Motivo de interrupção não encontrado.');
      }
  
      // Cria um novo registro no histórico de produção
      const historico = this.historicoProducaoRepository.create({
        pedido,
        funcionario: pedido.funcionarioResposavel, // Funcionário responsável pelo pedido
        acao: 'Pedido interrompido',
        detalhes: `Motivo: ${motivo.descricao}`,
        motivo_interrupcao: motivo,
        data_hora: new Date(), // Data e hora da ação
      });
  
      await this.em.persistAndFlush(historico); // Persiste o histórico no banco de dados
    }
  
    // Atualiza a data de atualização do pedido
    pedido.updated_at = new Date();
  
    // Sincroniza as alterações no banco de dados
    await this.em.flush();
    return pedido;
  }
}