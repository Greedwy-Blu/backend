export class Auth {
  id!: number;
  code!: string;
  password!: string;
  accessToken?: string;
  tokenExpiresAt?: Date;
  role!: string;
  funcionarioId?: number;
  gestaoId?: number;
  createdAt!: Date;
  updatedAt!: Date;
}


