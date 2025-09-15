export interface AuditLog {
  id: number;
  action: string;
  entityName: string;
  entityId: number;
  userId: number;
  details: string;
  timestamp: Date;
}


