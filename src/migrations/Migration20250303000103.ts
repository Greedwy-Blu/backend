import { Migration } from '@mikro-orm/migrations';

export class Migration20250303000103 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "funcionario" drop constraint "funcionario_auth_id_foreign";`);

    this.addSql(`alter table "gestao" drop constraint "gestao_auth_id_foreign";`);

    this.addSql(`alter table "funcionario" alter column "auth_id" type int using ("auth_id"::int);`);
    this.addSql(`alter table "funcionario" alter column "auth_id" drop not null;`);
    this.addSql(`alter table "funcionario" add constraint "funcionario_auth_id_foreign" foreign key ("auth_id") references "auth" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "gestao" alter column "auth_id" type int using ("auth_id"::int);`);
    this.addSql(`alter table "gestao" alter column "auth_id" drop not null;`);
    this.addSql(`alter table "gestao" add constraint "gestao_auth_id_foreign" foreign key ("auth_id") references "auth" ("id") on update cascade on delete set null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "funcionario" drop constraint "funcionario_auth_id_foreign";`);

    this.addSql(`alter table "gestao" drop constraint "gestao_auth_id_foreign";`);

    this.addSql(`alter table "funcionario" alter column "auth_id" type int using ("auth_id"::int);`);
    this.addSql(`alter table "funcionario" alter column "auth_id" set not null;`);
    this.addSql(`alter table "funcionario" add constraint "funcionario_auth_id_foreign" foreign key ("auth_id") references "auth" ("id") on update cascade;`);

    this.addSql(`alter table "gestao" alter column "auth_id" type int using ("auth_id"::int);`);
    this.addSql(`alter table "gestao" alter column "auth_id" set not null;`);
    this.addSql(`alter table "gestao" add constraint "gestao_auth_id_foreign" foreign key ("auth_id") references "auth" ("id") on update cascade;`);
  }

}
