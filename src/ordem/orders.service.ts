import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql'; // Importe o EntityManager
import { Order } from './entities/order.entity';
import { OrderTracking } from './entities/order-tracking.entity';
import { Funcionario } from '../colaborador/entities/employee.entity';
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

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const product = await this.productRepository.findOne({ code: createOrderDto.productCode });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
  
    const funcionarios = await this.funcionariosRepository.findOne({ code: createOrderDto.employeeCode });
    if (!funcionarios) {
      throw new NotFoundException('Funcionario not found');
    }
  
    const order = this.orderRepository.create({
      orderNumber: `OP-${Date.now()}`,
      product,
      funcionarioResposavel: funcionarios,
      lotQuantity: createOrderDto.lotQuantity,
      finalDestination: createOrderDto.finalDestination,
      created_at: '',
      updated_at: '',
      status: 'aberto'
    });
  
    await this.em.persistAndFlush(order); // Use o EntityManager para persistir e sincronizar
    return order;
  }

  async startTracking(trackOrderDto: TrackOrderDto): Promise<OrderTracking> {
    const order = await this.orderRepository.findOne(trackOrderDto.orderId);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const funcionarios = await this.funcionariosRepository.findOne({ code: trackOrderDto.employeeCode });
    if (!funcionarios) {
      throw new NotFoundException('funcionarios not found');
    }

    const tracking = this.orderTrackingRepository.create({
      order,
      funcionarios,
      startTime: new Date(),
    });

    await this.em.persistAndFlush(tracking); // Use o EntityManager para persistir e sincronizar
    return tracking;
  }

  async endTracking(trackingId: number, trackOrderDto: TrackOrderDto): Promise<OrderTracking> {
    const tracking = await this.orderTrackingRepository.findOne(trackingId);
    if (!tracking) {
      throw new NotFoundException('Tracking not found');
    }

    tracking.endTime = new Date();
    tracking.lostQuantity = trackOrderDto.lostQuantity;
    tracking.processedQuantity = trackOrderDto.processedQuantity;

    await this.em.flush(); // Use o EntityManager para sincronizar as alterações
    return tracking;
  }

  async getOrderReport(orderId: number) {
    const order = await this.orderRepository.findOne(orderId, { populate: ['trackings'] });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const totalProcessed = order.trackings.getItems().reduce((sum, tracking) => sum + (tracking.processedQuantity || 0), 0);
    const totalLost = order.trackings.getItems().reduce((sum, tracking) => sum + (tracking.lostQuantity || 0), 0);
    const efficiency = ((totalProcessed - totalLost) / totalProcessed) * 100;

    return {
      orderNumber: order.orderNumber,
      product: order.product.name,
      lotQuantity: order.lotQuantity,
      finalDestination: order.finalDestination,
      efficiency: efficiency.toFixed(2) + '%',
      trackings: order.trackings.getItems().map((tracking) => ({
        funcionarios: tracking.funcionarios.name,
        startTime: tracking.startTime,
        endTime: tracking.endTime,
        processedQuantity: tracking.processedQuantity,
        lostQuantity: tracking.lostQuantity,
      })),
    };
  }


  async createEtapa(orderId: number, nome: string, funcionarioCode: string): Promise<Etapa> {
    const order = await this.orderRepository.findOne(orderId);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
  
    const funcionario = await this.funcionariosRepository.findOne({ code: funcionarioCode });
    if (!funcionario) {
      throw new NotFoundException('Funcionario not found');
    }
  
    const etapa = this.em.create(Etapa, {
      nome,
      order,
      funcionario,
    });
  
    await this.em.persistAndFlush(etapa);
    return etapa;
  }


  async startEtapa(etapaId: number): Promise<Etapa> {
    const etapa = await this.em.findOne(Etapa, etapaId);
    if (!etapa) {
      throw new NotFoundException('Etapa not found');
    }
  
    etapa.inicio = new Date();
    await this.em.flush();
    return etapa;
  }

  async endEtapa(etapaId: number): Promise<Etapa> {
    const etapa = await this.em.findOne(Etapa, etapaId);
    if (!etapa) {
      throw new NotFoundException('Etapa not found');
    }
  
    etapa.fim = new Date();
    await this.em.flush();
    return etapa;
  }
  
  async listEtapasByOrder(orderId: number): Promise<Etapa[]> {
    const order = await this.orderRepository.findOne(orderId, { populate: ['etapas'] });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
  
    return order.etapas.getItems();
  }
  

  
  async atualizarStatusPedido(pedidoId: number, status: string, motivoId?: number): Promise<Order> {
    const pedido = await this.orderRepository.findOne(pedidoId);
    if (!pedido) {
      throw new NotFoundException('Pedido não encontrado');
    }

    pedido.status = status;

    if (status === 'interrompido' && motivoId) {
      const motivo = await this.motivoRepository.findOne(motivoId);
      if (!motivo) {
        throw new NotFoundException('Motivo de interrupção não encontrado');
      }

      const historico = new HistoricoProducao();
      historico.pedido = pedido;
      historico.acao = 'Pedido interrompido';
      historico.detalhes = `Motivo: ${motivo.descricao}`;
      historico.motivo_interrupcao = motivo;

      await this.em.persistAndFlush(historico);
    }

    await this.em.flush();
    return pedido;
  }
} 

