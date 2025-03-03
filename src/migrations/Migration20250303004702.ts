import { Migration } from '@mikro-orm/migrations';

export class Migration20250303004702 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "auth" add column "access_token" varchar(255) null, add column "token_expires_at" timestamptz null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "auth" drop column "access_token", drop column "token_expires_at";`);
  }

}
