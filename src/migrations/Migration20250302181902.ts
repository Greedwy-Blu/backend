import { Migration } from '@mikro-orm/migrations';

export class Migration20250302181902 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "etapa" drop constraint "etapa_order_id_fkey";`);

    this.addSql(`alter table "ordertracking" drop constraint "ordertracking_order_id_fkey";`);

    this.addSql(`alter table "funcionario" drop constraint "funcionario_auth_id_fkey";`);

    this.addSql(`alter table "gestor" drop constraint "gestor_auth_id_fkey";`);

    this.addSql(`create table "gestao" ("id" serial primary key, "code" varchar(255) not null, "name" varchar(255) not null, "department" varchar(255) not null, "role" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null);`);

    this.addSql(`create table "motivo_interrupcao" ("id" serial primary key, "codigo" varchar(255) not null, "descricao" varchar(255) not null);`);

    this.addSql(`create table "order" ("id" serial primary key, "order_number" varchar(255) not null, "name" varchar(255) not null, "product_id" int not null, "funcionario_resposavel_id" int not null, "lot_quantity" int not null, "final_destination" varchar(255) not null, "status" varchar(255) not null default 'aberto', "created_at" timestamptz not null, "updated_at" timestamptz not null);`);

    this.addSql(`create table "order_tracking" ("id" serial primary key, "order_id" int not null, "funcionarios_id" int not null, "start_time" timestamptz not null, "end_time" timestamptz null, "lost_quantity" int null, "processed_quantity" int null);`);

    this.addSql(`create table "historico_producao" ("id" serial primary key, "pedido_id" int not null, "funcionario_id" int not null, "acao" varchar(255) not null, "detalhes" varchar(255) null, "motivo_interrupcao_id" int null, "data_hora" timestamptz not null);`);

    this.addSql(`create table "sector_config" ("id" serial primary key, "sector_id" int not null, "field_name" varchar(255) not null, "field_type" varchar(255) not null);`);

    this.addSql(`create table "user" ("id" serial primary key, "username" varchar(255) not null, "password" varchar(255) not null, "role" varchar(255) not null);`);

    this.addSql(`alter table "order" add constraint "order_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade;`);
    this.addSql(`alter table "order" add constraint "order_funcionario_resposavel_id_foreign" foreign key ("funcionario_resposavel_id") references "funcionario" ("id") on update cascade;`);

    this.addSql(`alter table "order_tracking" add constraint "order_tracking_order_id_foreign" foreign key ("order_id") references "order" ("id") on update cascade;`);
    this.addSql(`alter table "order_tracking" add constraint "order_tracking_funcionarios_id_foreign" foreign key ("funcionarios_id") references "funcionario" ("id") on update cascade;`);

    this.addSql(`alter table "historico_producao" add constraint "historico_producao_pedido_id_foreign" foreign key ("pedido_id") references "order" ("id") on update cascade;`);
    this.addSql(`alter table "historico_producao" add constraint "historico_producao_funcionario_id_foreign" foreign key ("funcionario_id") references "funcionario" ("id") on update cascade;`);
    this.addSql(`alter table "historico_producao" add constraint "historico_producao_motivo_interrupcao_id_foreign" foreign key ("motivo_interrupcao_id") references "motivo_interrupcao" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "sector_config" add constraint "sector_config_sector_id_foreign" foreign key ("sector_id") references "sector" ("id") on update cascade;`);

    this.addSql(`drop table if exists "Order" cascade;`);

    this.addSql(`drop table if exists "auth" cascade;`);

    this.addSql(`drop table if exists "gestor" cascade;`);

    this.addSql(`drop table if exists "ordertracking" cascade;`);

    this.addSql(`drop table if exists "playing_with_neon" cascade;`);

    this.addSql(`drop table if exists "sectorconfig" cascade;`);

    this.addSql(`alter table "etapa" drop constraint "etapa_funcionario_id_fkey";`);

    this.addSql(`alter table "funcionario" drop constraint "funcionario_auth_id_key";`);
    this.addSql(`alter table "funcionario" drop constraint "funcionario_code_key";`);
    this.addSql(`alter table "funcionario" drop column "auth_id", drop column "createdat", drop column "updatedat";`);

    this.addSql(`alter table "funcionario" add column "created_at" timestamptz not null, add column "updated_at" timestamptz not null;`);
    this.addSql(`alter table "funcionario" alter column "salario" type int using ("salario"::int);`);

    this.addSql(`alter table "product" drop constraint "product_code_key";`);
    this.addSql(`alter table "product" drop column "createdat", drop column "updatedat";`);

    this.addSql(`alter table "product" alter column "description" type varchar(255) using ("description"::varchar(255));`);
    this.addSql(`alter table "product" alter column "price" type int using ("price"::int);`);

    this.addSql(`alter table "etapa" alter column "inicio" type timestamptz using ("inicio"::timestamptz);`);
    this.addSql(`alter table "etapa" alter column "inicio" drop not null;`);
    this.addSql(`alter table "etapa" add constraint "etapa_order_id_foreign" foreign key ("order_id") references "order" ("id") on update cascade;`);
    this.addSql(`alter table "etapa" add constraint "etapa_funcionario_id_foreign" foreign key ("funcionario_id") references "funcionario" ("id") on update cascade;`);

    this.addSql(`alter table "sector" drop column "description", drop column "createdat", drop column "updatedat";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "historico_producao" drop constraint "historico_producao_motivo_interrupcao_id_foreign";`);

    this.addSql(`alter table "order_tracking" drop constraint "order_tracking_order_id_foreign";`);

    this.addSql(`alter table "historico_producao" drop constraint "historico_producao_pedido_id_foreign";`);

    this.addSql(`alter table "etapa" drop constraint "etapa_order_id_foreign";`);

    this.addSql(`create table "Order" ("id" serial primary key, "ordernumber" varchar(255) not null, "name" varchar(255) not null, "product_id" int4 not null, "funcionarioresposavel_id" int4 not null, "lotquantity" int4 not null, "finaldestination" varchar(255) not null, "status" varchar(255) null default 'aberto', "created_at" timestamp(6) null default CURRENT_TIMESTAMP, "updated_at" timestamp(6) null default CURRENT_TIMESTAMP);`);
    this.addSql(`alter table "Order" add constraint "Order_ordernumber_key" unique ("ordernumber");`);

    this.addSql(`create table "auth" ("id" serial primary key, "username" varchar(255) not null, "password" varchar(255) not null, "token" varchar(255) null, "expiresat" timestamp(6) null, "role" text check ("role" in ('funcionario', 'gestor')) not null, "createdat" timestamp(6) null default CURRENT_TIMESTAMP, "updatedat" timestamp(6) null default CURRENT_TIMESTAMP);`);
    this.addSql(`alter table "auth" add constraint "auth_username_key" unique ("username");`);

    this.addSql(`create table "gestor" ("id" serial primary key, "auth_id" int4 not null, "code" varchar(255) not null, "name" varchar(255) not null, "department" varchar(255) not null, "role" varchar(255) not null, "createdat" timestamp(6) null default CURRENT_TIMESTAMP, "updatedat" timestamp(6) null default CURRENT_TIMESTAMP);`);
    this.addSql(`alter table "gestor" add constraint "gestor_auth_id_key" unique ("auth_id");`);
    this.addSql(`alter table "gestor" add constraint "gestor_code_key" unique ("code");`);

    this.addSql(`create table "ordertracking" ("id" serial primary key, "order_id" int4 not null, "funcionario_id" int4 not null, "starttime" timestamp(6) not null, "endtime" timestamp(6) null, "lostquantity" int4 null, "processedquantity" int4 null);`);

    this.addSql(`create table "playing_with_neon" ("id" serial primary key, "name" text not null, "value" float4 null);`);

    this.addSql(`create table "sectorconfig" ("id" serial primary key, "sector_id" int4 not null, "fieldname" varchar(255) not null, "fieldtype" varchar(255) not null);`);

    this.addSql(`alter table "Order" add constraint "Order_funcionarioresposavel_id_fkey" foreign key ("funcionarioresposavel_id") references "funcionario" ("id") on update no action on delete no action;`);
    this.addSql(`alter table "Order" add constraint "Order_product_id_fkey" foreign key ("product_id") references "product" ("id") on update no action on delete no action;`);

    this.addSql(`alter table "gestor" add constraint "gestor_auth_id_fkey" foreign key ("auth_id") references "auth" ("id") on update no action on delete cascade;`);

    this.addSql(`alter table "ordertracking" add constraint "ordertracking_funcionario_id_fkey" foreign key ("funcionario_id") references "funcionario" ("id") on update no action on delete no action;`);
    this.addSql(`alter table "ordertracking" add constraint "ordertracking_order_id_fkey" foreign key ("order_id") references "Order" ("id") on update no action on delete no action;`);

    this.addSql(`alter table "sectorconfig" add constraint "sectorconfig_sector_id_fkey" foreign key ("sector_id") references "sector" ("id") on update no action on delete no action;`);

    this.addSql(`drop table if exists "gestao" cascade;`);

    this.addSql(`drop table if exists "motivo_interrupcao" cascade;`);

    this.addSql(`drop table if exists "order" cascade;`);

    this.addSql(`drop table if exists "order_tracking" cascade;`);

    this.addSql(`drop table if exists "historico_producao" cascade;`);

    this.addSql(`drop table if exists "sector_config" cascade;`);

    this.addSql(`drop table if exists "user" cascade;`);

    this.addSql(`alter table "etapa" drop constraint "etapa_funcionario_id_foreign";`);

    this.addSql(`alter table "etapa" alter column "inicio" type timestamp(6) using ("inicio"::timestamp(6));`);
    this.addSql(`alter table "etapa" alter column "inicio" set not null;`);
    this.addSql(`alter table "etapa" add constraint "etapa_funcionario_id_fkey" foreign key ("funcionario_id") references "funcionario" ("id") on update no action on delete no action;`);
    this.addSql(`alter table "etapa" add constraint "etapa_order_id_fkey" foreign key ("order_id") references "Order" ("id") on update no action on delete no action;`);

    this.addSql(`alter table "funcionario" drop column "created_at", drop column "updated_at";`);

    this.addSql(`alter table "funcionario" add column "auth_id" int4 not null, add column "createdat" timestamp(6) null default CURRENT_TIMESTAMP, add column "updatedat" timestamp(6) null default CURRENT_TIMESTAMP;`);
    this.addSql(`alter table "funcionario" alter column "salario" type numeric(10,2) using ("salario"::numeric(10,2));`);
    this.addSql(`alter table "funcionario" add constraint "funcionario_auth_id_fkey" foreign key ("auth_id") references "auth" ("id") on update no action on delete cascade;`);
    this.addSql(`alter table "funcionario" add constraint "funcionario_auth_id_key" unique ("auth_id");`);
    this.addSql(`alter table "funcionario" add constraint "funcionario_code_key" unique ("code");`);

    this.addSql(`alter table "product" add column "createdat" timestamp(6) null default CURRENT_TIMESTAMP, add column "updatedat" timestamp(6) null default CURRENT_TIMESTAMP;`);
    this.addSql(`alter table "product" alter column "description" type text using ("description"::text);`);
    this.addSql(`alter table "product" alter column "price" type numeric(10,2) using ("price"::numeric(10,2));`);
    this.addSql(`alter table "product" add constraint "product_code_key" unique ("code");`);

    this.addSql(`alter table "sector" add column "description" text null, add column "createdat" timestamp(6) null default CURRENT_TIMESTAMP, add column "updatedat" timestamp(6) null default CURRENT_TIMESTAMP;`);
  }

}
