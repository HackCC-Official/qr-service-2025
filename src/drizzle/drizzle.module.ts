import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Pool } from "pg";
import { PG_CONNECTION } from "src/constants";
import { schema } from "./schema";
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { drizzle } from 'drizzle-orm/node-postgres';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: PG_CONNECTION,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const pool = new Pool({
          connectionString: configService.get('DATABASE_URL') || 'postgresql://postgres:5133',
          user: configService.get('DATABASE_USER') || 'postgres',
          password: configService.get('DATABASE_PASSWORD') || 'password',
          database: configService.get('DATABASE_DB') || 'qr-service-db',
        })
        
        return drizzle(pool, { schema }) as NodePgDatabase<typeof schema>;
      }
    }
  ],
  exports: [PG_CONNECTION]
})
export class DrizzleModule {}