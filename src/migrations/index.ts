import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // --- 1. Tabelas Independentes (sem chaves estrangeiras) ---

  await db.schema
    .createTable('product')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('code', 'varchar(255)', (col) => col.notNull().unique())
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .addColumn('description', 'text')
    .addColumn('price', 'decimal(10, 2)', (col) => col.notNull())
    .addColumn('quantity', 'integer', (col) => col.notNull())
    .execute();

  await db.schema
    .createTable('gestao')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('code', 'varchar(255)', (col) => col.notNull().unique())
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .addColumn('department', 'varchar(255)', (col) => col.notNull())
    .addColumn('role', 'varchar(255)', (col) => col.notNull())
    .addColumn('created_at', 'timestamptz', (col) => col.notNull())
    .addColumn('updated_at', 'timestamptz', (col) => col.notNull())
    .execute();

  await db.schema
    .createTable('funcionario')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .addColumn('code', 'varchar(255)', (col) => col.notNull().unique())
    .addColumn('password', 'varchar(255)', (col) => col.notNull())
    .execute();

  await db.schema
    .createTable('motivo_interrupcao')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('codigo', 'varchar(255)', (col) => col.notNull())
    .addColumn('descricao', 'varchar(255)', (col) => col.notNull())
    .execute();

  // CORREÇÃO: Criar 'sector' antes das tabelas que dependem dela.
  await db.schema
    .createTable('sector')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .execute();

  await db.schema
    .createTable('audit_log')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('user_id', 'integer', (col) => col.notNull())
    .addColumn('action', 'varchar(255)', (col) => col.notNull())
    .addColumn('entity', 'varchar(255)', (col) => col.notNull())
    .addColumn('entity_id', 'integer', (col) => col.notNull())
    .addColumn('timestamp', 'timestamptz', (col) => col.notNull())
    .execute();

  await db.schema
    .createTable('notification')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('user_id', 'integer', (col) => col.notNull())
    .addColumn('message', 'varchar(255)', (col) => col.notNull())
    .addColumn('read', 'boolean', (col) => col.notNull().defaultTo(false))
    .addColumn('created_at', 'timestamptz', (col) => col.notNull())
    .addColumn('updated_at', 'timestamptz', (col) => col.notNull())
    .execute();

  await db.schema
    .createTable('report')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('title', 'varchar(255)', (col) => col.notNull())
    .addColumn('content', 'text', (col) => col.notNull())
    .addColumn('created_at', 'timestamptz', (col) => col.notNull())
    .addColumn('updated_at', 'timestamptz', (col) => col.notNull())
    .execute();

  // --- 2. Tabelas Dependentes (com chaves estrangeiras) ---

  await db.schema
    .createTable('auth')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('code', 'varchar(255)', (col) => col.notNull().unique())
    .addColumn('password', 'varchar(255)', (col) => col.notNull())
    .addColumn('access_token', 'text')
    .addColumn('token_expires_at', 'timestamptz')
    .addColumn('role', 'varchar(255)', (col) => col.notNull())
    .addColumn('funcionario_id', 'integer', (col) => col.references('funcionario.id').onDelete('cascade'))
    .addColumn('gestao_id', 'integer', (col) => col.references('gestao.id').onDelete('cascade'))
    .addColumn('created_at', 'timestamptz', (col) => col.notNull())
    .addColumn('updated_at', 'timestamptz', (col) => col.notNull())
    .execute();

  await db.schema
    .createTable('order')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('order_number', 'varchar(255)', (col) => col.notNull())
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .addColumn('product_id', 'integer', (col) => col.references('product.id').onDelete('cascade').notNull())
    .addColumn('funcionario_resposavel_id', 'integer', (col) => col.references('funcionario.id').onDelete('cascade').notNull())
    .addColumn('lot_quantity', 'integer', (col) => col.notNull())
    .addColumn('final_destination', 'varchar(255)', (col) => col.notNull())
    .addColumn('status', 'varchar(255)', (col) => col.notNull().defaultTo('aberto'))
    .addColumn('created_at', 'timestamptz', (col) => col.notNull())
    .addColumn('updated_at', 'timestamptz', (col) => col.notNull())
    .execute();

  // CORREÇÃO: Criar 'sector_config' depois de 'sector'.
  await db.schema
    .createTable('sector_config')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('sector_id', 'integer', (col) => col.references('sector.id').onDelete('cascade').notNull())
    .addColumn('field_name', 'varchar(255)', (col) => col.notNull())
    .addColumn('field_type', 'varchar(255)', (col) => col.notNull())
    .execute();

  // CORREÇÃO: Criar 'maquina' depois de 'sector'.
  await db.schema
    .createTable('maquina')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .addColumn('code', 'varchar(255)', (col) => col.notNull().unique())
    .addColumn('sector_id', 'integer', (col) => col.references('sector.id').onDelete('cascade').notNull())
    .execute();

  // --- 3. Tabelas com Múltiplas Dependências ---

  await db.schema
    .createTable('order_tracking')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('order_id', 'integer', (col) => col.references('order.id').onDelete('cascade').notNull())
    .addColumn('funcionarios_id', 'integer', (col) => col.references('funcionario.id').onDelete('cascade').notNull())
    .addColumn('start_time', 'timestamptz', (col) => col.notNull())
    .addColumn('end_time', 'timestamptz')
    .addColumn('lost_quantity', 'integer')
    .addColumn('processed_quantity', 'integer')
    .execute();

  await db.schema
    .createTable('historico_producao')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('pedido_id', 'integer', (col) => col.references('order.id').onDelete('cascade').notNull())
    .addColumn('funcionario_id', 'integer', (col) => col.references('funcionario.id').onDelete('cascade').notNull())
    .addColumn('acao', 'varchar(255)', (col) => col.notNull())
    .addColumn('detalhes', 'varchar(255)')
    .addColumn('motivo_interrupcao_id', 'integer', (col) => col.references('motivo_interrupcao.id').onDelete('set null'))
    .addColumn('data_hora', 'timestamptz', (col) => col.notNull())
    .execute();

  await db.schema
    .createTable('etapa')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('nome', 'varchar(255)', (col) => col.notNull())
    .addColumn('order_id', 'integer', (col) => col.references('order.id').onDelete('cascade').notNull())
    .addColumn('funcionario_id', 'integer', (col) => col.references('funcionario.id').onDelete('cascade').notNull())
    .addColumn('inicio', 'timestamptz')
    .addColumn('fim', 'timestamptz')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  // A ordem de exclusão é o inverso exato da criação.
  await db.schema.dropTable('etapa').execute();
  await db.schema.dropTable('historico_producao').execute();
  await db.schema.dropTable('order_tracking').execute();
  await db.schema.dropTable('maquina').execute();
  await db.schema.dropTable('sector_config').execute();
  await db.schema.dropTable('order').execute();
  await db.schema.dropTable('auth').execute();
  await db.schema.dropTable('report').execute();
  await db.schema.dropTable('notification').execute();
  await db.schema.dropTable('audit_log').execute();
  await db.schema.dropTable('sector').execute();
  await db.schema.dropTable('motivo_interrupcao').execute();
  await db.schema.dropTable('funcionario').execute();
  await db.schema.dropTable('gestao').execute();
  await db.schema.dropTable('product').execute();
  // A tabela 'user' não estava na sua função 'up', então removi da 'down' para consistência.
}
