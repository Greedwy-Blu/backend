export interface Notification {
  id: number;
  recipientId: number;
  message: string;
  type: string;
  read: boolean;
  createdAt: Date;
}


