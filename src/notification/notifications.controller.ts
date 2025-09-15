import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('notifications')
@ApiBearerAuth()
@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('send')
  @Roles('gestao', 'funcionario')
  @ApiOperation({ summary: 'Enviar uma notificação' })
  @ApiResponse({ status: 201, description: 'Notificação enviada com sucesso.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        recipientId: { type: 'number', example: 1, description: 'ID do destinatário (usuário ou funcionário)' },
        message: { type: 'string', example: 'Sua ordem de produção #123 foi iniciada.', description: 'Conteúdo da notificação' },
        type: { type: 'string', example: 'info', description: 'Tipo da notificação (info, warning, error)' },
      },
      required: ['recipientId', 'message', 'type'],
    },
  })
  async sendNotification(
    @Body('recipientId') recipientId: number,
    @Body('message') message: string,
    @Body('type') type: string,
    @Request() req
  ) {
    // Aqui você pode adicionar lógica para determinar o tipo de destinatário (usuário/funcionário)
    // Por simplicidade, vamos assumir que recipientId é um userId por enquanto.
    return this.notificationsService.sendNotification(recipientId, message, type);
  }

  @Get('user/:userId')
  @Roles('gestao', 'funcionario')
  @ApiOperation({ summary: 'Obter notificações de um usuário' })
  @ApiResponse({ status: 200, description: 'Notificações retornadas com sucesso.' })
  @ApiParam({ name: 'userId', description: 'ID do usuário', example: 1 })
  async getUserNotifications(@Param('userId') userId: number, @Request() req) {
    return this.notificationsService.getNotificationsByUserId(userId);
  }

  @Post('mark-as-read/:notificationId')
  @Roles('gestao', 'funcionario')
  @ApiOperation({ summary: 'Marcar notificação como lida' })
  @ApiResponse({ status: 200, description: 'Notificação marcada como lida.' })
  @ApiParam({ name: 'notificationId', description: 'ID da notificação', example: 1 })
  async markNotificationAsRead(@Param('notificationId') notificationId: number, @Request() req) {
    return this.notificationsService.markAsRead(notificationId);
  }
}


