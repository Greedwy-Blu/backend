import { Injectable, Logger } from '@nestjs/common';

export interface EmailNotification {
  to: string;
  subject: string;
  message: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  attachments?: string[];
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  /**
   * Envia um email de notificação
   * Nota: Esta é uma implementação básica. Em produção, você deve usar
   * um serviço como SendGrid, AWS SES, ou configurar SMTP
   */
  async sendNotificationEmail(notification: EmailNotification): Promise<boolean> {
    try {
      // Implementação simulada - substitua por um provedor real de email
      this.logger.log(`[SIMULADO] Email enviado para: ${notification.to}`);
      this.logger.log(`[SIMULADO] Assunto: ${notification.subject}`);
      this.logger.log(`[SIMULADO] Mensagem: ${notification.message}`);
      this.logger.log(`[SIMULADO] Prioridade: ${notification.priority || 'normal'}`);

      // Simula delay de envio
      await new Promise(resolve => setTimeout(resolve, 100));

      return true;
    } catch (error) {
      this.logger.error('Erro ao enviar email:', error);
      return false;
    }
  }

  /**
   * Envia email de alerta crítico
   */
  async sendCriticalAlert(
    recipientEmail: string, 
    orderId: number, 
    alertMessage: string
  ): Promise<boolean> {
    return this.sendNotificationEmail({
      to: recipientEmail,
      subject: `🚨 ALERTA CRÍTICO - Ordem ${orderId}`,
      message: `
        Um alerta crítico foi gerado para a ordem de produção ${orderId}.
        
        Detalhes do alerta:
        ${alertMessage}
        
        Por favor, tome as medidas necessárias imediatamente.
        
        Sistema de Apontamento de Produção
      `,
      priority: 'urgent',
    });
  }

  /**
   * Envia email de resumo diário
   */
  async sendDailySummary(
    recipientEmail: string, 
    summary: {
      ordersCompleted: number;
      ordersInProgress: number;
      alertsGenerated: number;
      date: Date;
    }
  ): Promise<boolean> {
    return this.sendNotificationEmail({
      to: recipientEmail,
      subject: `Resumo Diário de Produção - ${summary.date.toLocaleDateString('pt-BR')}`,
      message: `
        Resumo das atividades de produção do dia ${summary.date.toLocaleDateString('pt-BR')}:
        
        📋 Ordens finalizadas: ${summary.ordersCompleted}
        ⏳ Ordens em andamento: ${summary.ordersInProgress}
        ⚠️ Alertas gerados: ${summary.alertsGenerated}
        
        Sistema de Apontamento de Produção
      `,
      priority: 'normal',
    });
  }

  /**
   * Envia email de boas-vindas para novos usuários
   */
  async sendWelcomeEmail(
    recipientEmail: string, 
    userName: string
  ): Promise<boolean> {
    return this.sendNotificationEmail({
      to: recipientEmail,
      subject: 'Bem-vindo ao Sistema de Apontamento de Produção',
      message: `
        Olá ${userName},
        
        Bem-vindo ao Sistema de Apontamento de Produção!
        
        Você agora tem acesso ao sistema e receberá notificações sobre:
        - Novas ordens de produção
        - Atualizações de status
        - Alertas importantes
        
        Se tiver dúvidas, entre em contato com o suporte.
        
        Sistema de Apontamento de Produção
      `,
      priority: 'normal',
    });
  }
}

