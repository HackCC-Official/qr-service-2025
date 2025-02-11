import { Inject, Injectable } from "@nestjs/common";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { PG_CONNECTION } from "src/constants";
import { schema } from "src/drizzle/schema";

@Injectable()
export class WorkshopService {
  constructor(
    @Inject(PG_CONNECTION)
    private db: NodePgDatabase<typeof schema>,
    @InjectPinoLogger(WorkshopService.name)
    private readonly logger: PinoLogger
  ) {}

  async findAll() {
    return await this.db
      .query
      .workshops
      .findMany();
  }
}