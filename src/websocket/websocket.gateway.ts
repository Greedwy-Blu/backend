import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

interface AuthenticatedSocket extends Socket {
  userId?: number;
  userRole?: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  namespace: '/notifications',
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationGateway.name);
  private connectedUsers = new Map<number, AuthenticatedSocket[]>();

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      // Extrai o token do handshake
      const token = client.handshake.auth?.token || client.handshake.headers?.authorization?.replace('Bearer ', '');
      
      if (!token) {
        this.logger.warn(`Cliente ${client.id} tentou conectar sem token`);
        client.disconnect();
        return;
      }

      // Verifica e decodifica o token JWT
      const payload = this.jwtService.verify(token);
      client.userId = payload.sub || payload.id;
      client.userRole = payload.role;

      // Adiciona o cliente à lista de usuários conectados
      if (typeof client.userId === 'number') {
        if (!this.connectedUsers.has(client.userId)) {
          this.connectedUsers.set(client.userId, []);
        }
        this.connectedUsers.get(client.userId)!.push(client);
      }

      // Junta o cliente ao room do seu ID de usuário
      await client.join(`user_${client.userId}`);

      this.logger.log(`Usuário ${client.userId} conectado via WebSocket (${client.id})`);
      
      // Envia confirmação de conexão
      client.emit('connected', {
        message: 'Conectado ao sistema de notificações',
        userId: client.userId,
        timestamp: new Date(),
      });

    } catch (error) {
      this.logger.error(`Erro na autenticação WebSocket: ${error.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    if (client.userId) {
      const userSockets = this.connectedUsers.get(client.userId);
      if (userSockets) {
        const index = userSockets.indexOf(client);
        if (index > -1) {
          userSockets.splice(index, 1);
        }
        
        // Remove o usuário da lista se não há mais conexões
        if (userSockets.length === 0) {
          this.connectedUsers.delete(client.userId);
        }
      }
      
      this.logger.log(`Usuário ${client.userId} desconectado do WebSocket (${client.id})`);
    }
  }

  @SubscribeMessage('join_order_room')
  async handleJoinOrderRoom(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { orderId: number }
  ) {
    if (!client.userId) {
      return { error: 'Usuário não autenticado' };
    }

    await client.join(`order_${data.orderId}`);
    this.logger.log(`Usuário ${client.userId} entrou no room da ordem ${data.orderId}`);
    
    return { 
      success: true, 
      message: `Conectado às atualizações da ordem ${data.orderId}` 
    };
  }

  @SubscribeMessage('leave_order_room')
  async handleLeaveOrderRoom(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { orderId: number }
  ) {
    await client.leave(`order_${data.orderId}`);
    this.logger.log(`Usuário ${client.userId} saiu do room da ordem ${data.orderId}`);
    
    return { 
      success: true, 
      message: `Desconectado das atualizações da ordem ${data.orderId}` 
    };
  }

  @SubscribeMessage('mark_notification_read')
  async handleMarkNotificationRead(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { notificationId: number }
  ) {
    if (!client.userId) {
      return { error: 'Usuário não autenticado' };
    }

    // Aqui você pode adicionar lógica para marcar a notificação como lida
    this.logger.log(`Usuário ${client.userId} marcou notificação ${data.notificationId} como lida`);
    
    return { 
      success: true, 
      notificationId: data.notificationId 
    };
  }

  /**
   * Envia uma notificação para um usuário específico
   */
  sendNotificationToUser(userId: number, notification: any): void {
    this.server.to(`user_${userId}`).emit('new_notification', {
      ...notification,
      timestamp: new Date(),
    });

    this.logger.log(`Notificação enviada via WebSocket para usuário ${userId}`);
  }

  /**
   * Envia uma atualização de ordem para todos os usuários conectados ao room da ordem
   */
  sendOrderUpdate(orderId: number, update: any): void {
    this.server.to(`order_${orderId}`).emit('order_update', {
      orderId,
      ...update,
      timestamp: new Date(),
    });

    this.logger.log(`Atualização da ordem ${orderId} enviada via WebSocket`);
  }
  async sendToOrderRoom(orderId: string | number, payload: any): Promise<void> {
    const roomName = `order-${orderId}`; // Cria um nome padronizado para a sala
    this.server.to(roomName).emit('order_event', payload);
  }
  /**
   * Envia um alerta para múltiplos usuários
   */
  sendAlertToUsers(userIds: number[], alert: any): void {
    userIds.forEach(userId => {
      this.server.to(`user_${userId}`).emit('alert', {
        ...alert,
        timestamp: new Date(),
      });
    });

    this.logger.log(`Alerta enviado via WebSocket para ${userIds.length} usuários`);
  }

  /**
   * Envia uma mensagem broadcast para todos os usuários conectados
   */
  sendBroadcast(message: any): void {
    this.server.emit('broadcast', {
      ...message,
      timestamp: new Date(),
    });

    this.logger.log('Mensagem broadcast enviada via WebSocket');
  }

  /**
   * Obtém a lista de usuários conectados
   */
  getConnectedUsers(): number[] {
    return Array.from(this.connectedUsers.keys());
  }

  /**
   * Verifica se um usuário está conectado
   */
  isUserConnected(userId: number): boolean {
    return this.connectedUsers.has(userId) && this.connectedUsers.get(userId)!.length > 0;
  }

  /**
   * Obtém o número de conexões de um usuário
   */
  getUserConnectionCount(userId: number): number {
    return this.connectedUsers.get(userId)?.length || 0;
  }
}

