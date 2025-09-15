import { Injectable } from '@nestjs/common';
import { db } from '../config/database.config';
import { AuditLog } from './entities/audit-log.entity';

@Injectable()
export class AuditService {
  async createAuditLog(action: string, entityName: string, entityId: number, userId: number, details: any): Promise<AuditLog> {
    const newLog = await db.insertInto('audit_log')
      .values({
        action,
        entityName,
        entityId,
        userId,
        details: JSON.stringify(details),
        timestamp: new Date(),
      })
      .returningAll()
      .executeTakeFirstOrThrow();
    return newLog;
  }

  async getAuditLogs(): Promise<AuditLog[]> {
    return db.selectFrom('audit_log').selectAll().execute();
  }
}


