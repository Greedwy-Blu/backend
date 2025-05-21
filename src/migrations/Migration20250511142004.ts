import { Migration } from '@mikro-orm/migrations';

export class Migration20250511142004 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "maquina" ("id" serial primary key, "codigo" varchar(255) not null, "nome" varchar(255) not null, "tipo" varchar(255) not null, "modelo" varchar(255) not null, "fabricante" varchar(255) not null, "capacidade" varchar(255) null, "status" varchar(255) not null default 'ativa', "created_at" timestamptz not null, "updated_at" timestamptz not null);`);

    this.addSql(`alter table "gestao" add column "password" varchar(255) not null;`);

    this.addSql(`alter table "order" add column "maquina_id" int null;`);
    this.addSql(`alter table "order" add constraint "order_maquina_id_foreign" foreign key ("maquina_id") references "maquina" ("id") on update cascade on delete set null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "order" drop constraint "order_maquina_id_foreign";`);

    this.addSql(`drop table if exists "maquina" cascade;`);

    this.addSql(`alter table "gestao" drop column "password";`);

    this.addSql(`alter table "order" drop column "maquina_id";`);
  }

}
