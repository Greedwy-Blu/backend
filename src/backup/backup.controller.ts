import { Controller, Post, Get, Param, UseGuards, Request, NotFoundException } from '@nestjs/common';
import { BackupService } from './backup.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('backup')
@ApiBearerAuth()
@Controller('backup')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BackupController {
  constructor(private readonly backupService: BackupService) {}

  @Post('create')
  @Roles('gestao')
  @ApiOperation({ summary: 'Criar um backup do banco de dados' })
  @ApiResponse({ status: 201, description: 'Backup criado com sucesso.' })
  async createBackup(@Request() req) {
    const filePath = await this.backupService.createDatabaseBackup();
    return { message: 'Backup criado com sucesso', filePath };
  }

  @Get('list')
  @Roles('gestao')
  @ApiOperation({ summary: 'Listar todos os backups disponíveis' })
  @ApiResponse({ status: 200, description: 'Lista de backups retornada com sucesso.' })
  async listBackups(@Request() req) {
    return this.backupService.listBackups();
  }

  @Post('restore/:fileName')
  @Roles('gestao')
  @ApiOperation({ summary: 'Restaurar um backup do banco de dados' })
  @ApiResponse({ status: 200, description: 'Backup restaurado com sucesso.' })
  @ApiResponse({ status: 404, description: 'Arquivo de backup não encontrado.' })
  @ApiParam({ name: 'fileName', description: 'Nome do arquivo de backup (ex: backup_2023-01-01_12-00-00.sql)' })
  async restoreBackup(@Param('fileName') fileName: string, @Request() req) {
    const filePath = await this.backupService.restoreDatabaseBackup(fileName);
    return { message: 'Backup restaurado com sucesso', filePath };
  }
}


