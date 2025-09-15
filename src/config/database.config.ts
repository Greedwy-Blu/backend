import { Kysely, PostgresDialect, Generated } from 'kysely';
import { Pool } from 'pg';

interface AuthTable {
  id: Generated<number>;
  code: string;
  password: string;
  accessToken?: string;
  tokenExpiresAt?: Date;
  role: string;
  funcionarioId?: number; // Foreign key to Funcionario
  gestaoId?: number; // Foreign key to Gestao
  createdAt: Date;
  updatedAt: Date;
}

interface FuncionarioTable {
  id: Generated<number>;
  code: string;
  nome: string;
  cargo: string;
  salario: number;
  authId?: number; // Foreign key to Auth
  createdAt: Date;
  updatedAt: Date;
}

interface GestaoTable {
  id: Generated<number>;
  code: string;
  name: string;
  department: string;
  role: string;
  authId?: number; // Foreign key to Auth
  createdAt: Date;
  updatedAt: Date;
}

interface MaquinaTable {
  id: Generated<number>;
  codigo: string;
  nome: string;
  tipo: string;
  modelo: string;
  fabricante: string;
  capacidade?: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

interface EtapaTable {
  id: Generated<number>;
  nome: string;
  orderId: number; // Foreign key to Order
  funcionarioId: number; // Foreign key to Funcionario
  inicio?: Date;
  fim?: Date;
}

interface HistoricoProducaoTable {
  id: Generated<number>;
  orderId: number; // Foreign key to Order
  funcionarioId: number; // Foreign key to Funcionario
  acao: string;
  detalhes?: string;
  motivoInterrupcaoId?: number; // Foreign key to MotivoInterrupcao
  data_hora: Date;
}

interface MotivoInterrupcaoTable {
  id: Generated<number>;
  codigo: string;
  descricao: string;
}

interface OrderTable {
  id: Generated<number>;
  orderNumber: string;
  name: string;
  productId: number; // Foreign key to Product
  funcionarioResposavelId: number; // Foreign key to Funcionario
  maquinaId?: number; // Foreign key to Maquina
  lotQuantity: number;
  finalDestination: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

interface OrderTrackingTable {
  id: Generated<number>;
  orderId: number; // Foreign key to Order
  funcionarioId: number; // Foreign key to Funcionario
  startTime: Date;
  endTime?: Date;
  lostQuantity?: number;
  processedQuantity?: number;
}

interface ProductTable {
  id: Generated<number>;
  code: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
}

interface SectorTable {
  id: Generated<number>;
  name: string;
}

interface SectorConfigTable {
  id: Generated<number>;
  sectorId: number; // Foreign key to Sector
  fieldName: string;
  fieldType: string;
}

interface Database {
  auth: AuthTable;
  funcionario: FuncionarioTable;
  gestao: GestaoTable;
  maquina: MaquinaTable;
  etapa: EtapaTable;
  historico_producao: HistoricoProducaoTable;
  motivo_interrupcao: MotivoInterrupcaoTable;
  order: OrderTable;
  order_tracking: OrderTrackingTable;
  product: ProductTable;
  sector: SectorTable;
  sector_config: SectorConfigTable;
}

export const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL,
    }),
  }),
});


