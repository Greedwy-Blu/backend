import { Migration } from '@mikro-orm/migrations';

export class Migration20250302212459 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "auth" ("id" serial primary key, "username" varchar(255) not null, "password" varchar(255) not null, "token" varchar(255) null, "expires_at" timestamptz null, "role" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null);`);
    this.addSql(`alter table "auth" add constraint "auth_username_unique" unique ("username");`);

    this.addSql(`drop table if exists "user" cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table "user" ("id" serial primary key, "username" varchar(255) not null, "password" varchar(255) not null, "role" varchar(255) not null);`);

    this.addSql(`drop table if exists "auth" cascade;`);
  }

}
