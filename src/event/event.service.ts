import { Inject, Injectable, Logger } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { PG_CONNECTION } from "src/constants";
import { schema } from "src/drizzle/schema";
import { RequestEventDTO } from "src/drizzle/schema/event";

@Injectable()
export class EventService {
  constructor(
    @Inject(PG_CONNECTION)
    private db: NodePgDatabase<typeof schema>,
    @InjectPinoLogger(EventService.name)
    private readonly logger: PinoLogger
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

  async findByDate(date: string) {
    return this.db
      .query
      .events
      .findFirst({ where: eq(schema.events.date, date) });
  }

  async create(createEventDTO: RequestEventDTO) {
    const event = await this
      .db
      .insert(schema.events)
      .values(createEventDTO)
      .returning();

    this.logger.info({ msg: 'Creating event', event });

    return event;
  }

  async update(eventId: string, updateEventDTO: RequestEventDTO) {
    const event = await this
      .db
      .update(schema.events)
      .set(updateEventDTO)
      .where(eq(schema.events.id, eventId))
      .returning();

    this.logger.info({ msg: 'Updating event', event });

    return event;
  }

  async delete(eventId: string) {
    const event = await this
      .db
      .delete(schema.events)
      .where(eq(schema.events.id, eventId))
      .returning();
    
    this.logger.info({ msg: 'Deleting event', event });
    
    return event;
  }
}