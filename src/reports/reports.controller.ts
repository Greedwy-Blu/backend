import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('reports')
@ApiBearerAuth()
@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('order/:id')
  @Roles('gestao')
  @ApiOperation({ summary: 'Gerar relatório de uma ordem específica' })
  @ApiResponse({ status: 200, description: 'Relatório da ordem gerado com sucesso.' })
  @ApiParam({ name: 'id', description: 'ID da ordem', example: 1 })
  async getOrderReport(@Param('id') orderId: number, @Request() req) {
    return this.reportsService.generateOrderReport(orderId);
  }
}


