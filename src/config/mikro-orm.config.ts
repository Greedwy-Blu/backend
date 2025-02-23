import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import * as path from 'path';
import { Migrator } from '@mikro-orm/migrations';
import { neon } from '@neondatabase/serverless';


const config: Options<PostgreSqlDriver> = {
  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts'],
  extensions: [Migrator],
  clientUrl: "postgresql://neondb_owner:npg_nA6EhTiky1It@ep-square-union-a8opakjy.eastus2.azure.neon.tech/neondb?sslmode=require", // Fallback value
  driver: PostgreSqlDriver,
  driverOptions: {
    connection: {
      ssl: {
        rejectUnauthorized: false, // Use this if you encounter self-signed certificate issues
      },
    },
  },
  debug: true,
  migrations: {
    path: './dist/migrations',
    pathTs: './src/migrations',
  },
};

export default config;