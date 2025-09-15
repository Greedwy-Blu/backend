import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { exec } from 'child_process';
import * as path from 'path';
import * as fs from 'fs/promises';

@Injectable()
export class BackupService {
  private readonly logger = new Logger(BackupService.name);
  private readonly backupDir = path.join(process.cwd(), 'backups');

  constructor() {
    this.ensureBackupDirExists();
  }

  private async ensureBackupDirExists() {
    try {
      await fs.mkdir(this.backupDir, { recursive: true });
      this.logger.log(`Diretório de backup garantido: ${this.backupDir}`);
    } catch (error) {
      this.logger.error(`Falha ao criar diretório de backup: ${error.message}`);
      throw new InternalServerErrorException('Falha ao inicializar o serviço de backup.');
    }
  }

  async createDatabaseBackup(): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
    const backupFileName = `backup_${timestamp}.sql`;
    const backupFilePath = path.join(this.backupDir, backupFileName);

    // Assumindo que você está usando PostgreSQL e tem pg_dump disponível
    // Você precisará configurar as variáveis de ambiente para o seu banco de dados
    const dbUser = process.env.DB_USER || 'postgres';
    const dbName = process.env.DB_NAME || 'your_database_name'; // Substitua pelo nome do seu banco
    const dbHost = process.env.DB_HOST || 'localhost';
    const dbPort = process.env.DB_PORT || '5432';

    const command = `pg_dump -U ${dbUser} -h ${dbHost} -p ${dbPort} -F p -d ${dbName} > ${backupFilePath}`;

    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          this.logger.error(`Erro ao criar backup: ${stderr}`);
          return reject(new InternalServerErrorException(`Falha ao criar backup do banco de dados: ${error.message}`));
        }
        this.logger.log(`Backup do banco de dados criado com sucesso: ${backupFilePath}`);
        resolve(backupFilePath);
      });
    });
  }

  async listBackups(): Promise<string[]> {
    try {
      const files = await fs.readdir(this.backupDir);
      return files.filter(file => file.endsWith('.sql')).map(file => path.join(this.backupDir, file));
    } catch (error) {
      this.logger.error(`Falha ao listar backups: ${error.message}`);
      throw new InternalServerErrorException('Falha ao listar backups.');
    }
  }

  async restoreDatabaseBackup(backupFileName: string): Promise<string> {
    const backupFilePath = path.join(this.backupDir, backupFileName);

    try {
      await fs.access(backupFilePath);
    } catch (error) {
      throw new NotFoundException(`Arquivo de backup ${backupFileName} não encontrado.`);
    }

    const dbUser = process.env.DB_USER || 'postgres';
    const dbName = process.env.DB_NAME || 'your_database_name'; // Substitua pelo nome do seu banco
    const dbHost = process.env.DB_HOST || 'localhost';
    const dbPort = process.env.DB_PORT || '5432';

    // CUIDADO: Restaurar um backup irá sobrescrever o banco de dados atual.
    // Recomenda-se parar a aplicação antes de restaurar.
    const command = `psql -U ${dbUser} -h ${dbHost} -p ${dbPort} -d ${dbName} < ${backupFilePath}`;

    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          this.logger.error(`Erro ao restaurar backup: ${stderr}`);
          return reject(new InternalServerErrorException(`Falha ao restaurar backup do banco de dados: ${error.message}`));
        }
        this.logger.log(`Backup do banco de dados restaurado com sucesso de: ${backupFilePath}`);
        resolve(backupFilePath);
      });
    });
  }
}


