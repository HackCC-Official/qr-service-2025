import { Inject, Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { PG_CONNECTION } from "src/constants";
import { schema } from "src/drizzle/schema";
import { RequestEventDTO } from "src/drizzle/schema/event";

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

  async findById(id: string) {
    return this.db
      .query
      .events
      .findFirst({ where: eq(schema.events.id, id) });
  }

  async create(createEventDTO: RequestEventDTO) {
    console.log(createEventDTO)
    return this
      .db
      .insert(schema.events)
      .values(createEventDTO)
      .returning();
  }
}