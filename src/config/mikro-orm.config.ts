import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import * as path from 'path';
import { Migrator } from '@mikro-orm/migrations';

const config: Options<PostgreSqlDriver> = {
  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts'],
  extensions: [Migrator],
  clientUrl: `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  driver: PostgreSqlDriver,
  debug: true,
  migrations: {
    path: './dist/migrations',
    pathTs: './src/migrations',
  },
};

export default config;