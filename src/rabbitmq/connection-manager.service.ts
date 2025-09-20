import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as amqp from 'amqplib';
import { Connection, Channel } from 'amqplib';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

export interface ConnectionManagerOptions {
  url: string;
  reconnectDelay?: number;
  maxReconnectAttempts?: number;
  heartbeat?: number;
  connectionTimeout?: number;
}

@Injectable()
export class ConnectionManagerService {
  private readonly logger = new Logger(ConnectionManagerService.name);
  private connection: Connection | null = null;
  private channel: Channel | null = null;
  private isConnecting = false;
  private reconnectAttempts = 0;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private client: ClientProxy;
  private options: ConnectionManagerOptions; // Adicionado para resolver o erro de propriedade ausente

  private connectionListeners: Array<(connected: boolean) => void> = [];

  constructor(options?: Partial<ConnectionManagerOptions>) {
    // Definir opções padrão e mesclar com as fornecidas
    this.options = {
      url: options?.url || 'amqp://localhost:5672', // URL padrão
      reconnectDelay: options?.reconnectDelay || 5000, // 5 segundos
      maxReconnectAttempts: options?.maxReconnectAttempts || 10, // 10 tentativas
      heartbeat: options?.heartbeat || 60, // 60 segundos
      connectionTimeout: options?.connectionTimeout || 5000, // 5 segundos
    };

    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [this.options.url],
        queue: 'notification',
      },
    });
  }


  /**
   * Verifica se está conectado
   */
  isConnected(): boolean {
    return this.connection !== null && this.channel !== null;
  }

  /**
   * Obtém o canal atual
   */
  getChannel(): Channel | null {
    return this.channel;
  }

  /**
   * Obtém a conexão atual
   */
  getConnection(): Connection | null {
    return this.connection;
  }

  

  /**
   * Adiciona um listener para mudanças de estado da conexão
   */
  addConnectionListener(listener: (connected: boolean) => void): void {
    this.connectionListeners.push(listener);
  }

  /**
   * Remove um listener de mudanças de estado da conexão
   */
  removeConnectionListener(listener: (connected: boolean) => void): void {
    const index = this.connectionListeners.indexOf(listener);
    if (index > -1) {
      this.connectionListeners.splice(index, 1);
    }
  }

  /**
   * Notifica todos os listeners sobre mudanças de estado
   */
  private notifyConnectionListeners(connected: boolean): void {
    this.connectionListeners.forEach(listener => {
      try {
        listener(connected);
      } catch (error: any) {
        this.logger.error(`Erro ao notificar listener de conexão: ${error.message}`);
      }
    });
  }

  
 
}


