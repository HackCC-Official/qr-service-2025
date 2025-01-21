import { Inject, Injectable } from "@nestjs/common";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { PG_CONNECTION } from "src/constants";
import { schema } from "src/drizzle/schema";

@Injectable()
export class EventService {
  constructor(
    @Inject(PG_CONNECTION)
    private db: NodePgDatabase<typeof schema>
  ) {}

  async findAll() {
    return this.db
      .query
      .events
      .findMany();
  }
}