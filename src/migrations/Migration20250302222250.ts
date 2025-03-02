import { Migration } from '@mikro-orm/migrations';

export class Migration20250302222250 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "auth" drop constraint "auth_username_unique";`);
    this.addSql(`alter table "auth" drop column "token", drop column "expires_at";`);

    this.addSql(`alter table "auth" rename column "username" to "code";`);

    this.addSql(`alter table "funcionario" add column "auth_id" int not null;`);
    this.addSql(`alter table "funcionario" add constraint "funcionario_auth_id_foreign" foreign key ("auth_id") references "auth" ("id") on update cascade;`);
    this.addSql(`alter table "funcionario" add constraint "funcionario_auth_id_unique" unique ("auth_id");`);

    this.addSql(`alter table "gestao" add column "auth_id" int not null;`);
    this.addSql(`alter table "gestao" add constraint "gestao_auth_id_foreign" foreign key ("auth_id") references "auth" ("id") on update cascade;`);
    this.addSql(`alter table "gestao" add constraint "gestao_auth_id_unique" unique ("auth_id");`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "funcionario" drop constraint "funcionario_auth_id_foreign";`);

    this.addSql(`alter table "gestao" drop constraint "gestao_auth_id_foreign";`);

    this.addSql(`alter table "auth" add column "token" varchar(255) null, add column "expires_at" timestamptz null;`);
    this.addSql(`alter table "auth" rename column "code" to "username";`);
    this.addSql(`alter table "auth" add constraint "auth_username_unique" unique ("username");`);

    this.addSql(`alter table "funcionario" drop constraint "funcionario_auth_id_unique";`);
    this.addSql(`alter table "funcionario" drop column "auth_id";`);

    this.addSql(`alter table "gestao" drop constraint "gestao_auth_id_unique";`);
    this.addSql(`alter table "gestao" drop column "auth_id";`);
  }

}
