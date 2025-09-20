import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('gestao')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('code', 'varchar(255)', (col) => col.notNull())
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .addColumn('department', 'varchar(255)', (col) => col.notNull())
    .addColumn('role', 'varchar(255)', (col) => col.notNull())
    .addColumn('created_at', 'timestamptz', (col) => col.notNull())
    .addColumn('updated_at', 'timestamptz', (col) => col.notNull())
    .execute();

  await db.schema
    .createTable('motivo_interrupcao')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('codigo', 'varchar(255)', (col) => col.notNull())
    .addColumn('descricao', 'varchar(255)', (col) => col.notNull())
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
    .createTable('sector_config')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('sector_id', 'integer', (col) => col.references('sector.id').onDelete('cascade').notNull())
    .addColumn('field_name', 'varchar(255)', (col) => col.notNull())
    .addColumn('field_type', 'varchar(255)', (col) => col.notNull())
    .execute();

  await db.schema
    .createTable('user')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('username', 'varchar(255)', (col) => col.notNull())
    .addColumn('password', 'varchar(255)', (col) => col.notNull())
    .addColumn('role', 'varchar(255)', (col) => col.notNull())
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
  await db.schema.dropTable('etapa').execute();
  await db.schema.dropTable('user').execute();
  await db.schema.dropTable('sector_config').execute();
  await db.schema.dropTable('historico_producao').execute();
  await db.schema.dropTable('order_tracking').execute();
  await db.schema.dropTable('order').execute();
  await db.schema.dropTable('motivo_interrupcao').execute();
  await db.schema.dropTable('gestao').execute();
}


