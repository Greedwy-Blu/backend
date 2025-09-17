import { Injectable } from '@nestjs/common';
import { db } from '../config/database.config';
import { AuditLog } from './entities/audit-log.entity';

@Injectable()
export class AuditService {
  async createAuditLog(action: string, entityName: string, entityId: number, userId: number, details: any): Promise<AuditLog> {
    const newLog = await db.insertInto('audit')
      .values({
        id: undefined, // Assuming id is auto-generated
        action,
        entityId,
        userId,
        entity: entityName,
        timestamp: new Date(),
      })
      .returningAll()
      .executeTakeFirstOrThrow();
    return {
      ...newLog,
      entityName,
      details,
    };
  }

// In src/audit/audit.service.ts

async getAuditLogs(): Promise<AuditLog[]> {
    const rawLogs = await db.selectFrom('audit').selectAll().execute();

     const auditLogs: AuditLog[] = rawLogs.map(log => {
        return {
            ...log,
            entityName: log.entity, 
            details: '' 
        };
    });

    return auditLogs;
}
}
