 import { Inject, Injectable, Logger } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { PG_CONNECTION } from "src/constants";
import { schema } from "src/drizzle/schema";
import { RequestEventDTO } from "./response-event.dto";
import { ResponseEventDTO } from "./request-event.dto";

@Injectable()
export class EventService {
  constructor(
    @Inject(PG_CONNECTION)
    private db: NodePgDatabase<typeof schema>,
    @InjectPinoLogger(EventService.name)
    private readonly logger: PinoLogger
  ) {}

  async findAll() {
    return await this.db
      .query
      .events
      .findMany();
  }

  isValidCheckInTime(checkedInAtStr: string, event: ResponseEventDTO) {
    const checkedInAt = new Date(checkedInAtStr)
    const startingTime = new Date(event.startingTime);
    const endingTime = new Date(event.endingTime);

    if (checkedInAt <= startingTime) {
      this.logger.error("Attempting to check in before starting time")
    } else if (checkedInAt >= endingTime) {
      this.logger.error("Attempting to check after ending time")
    }

    return !(checkedInAt <= startingTime || checkedInAt >= endingTime);
  }

  async findById(id: string) : Promise<ResponseEventDTO> {
    return this.db
      .query
      .events
      .findFirst({ where: eq(schema.events.id, id) });
  }

  async findByDate(date: string) : Promise<ResponseEventDTO> {
    return this.db
      .query
      .events
      .findFirst({ where: eq(schema.events.date, date) });
  }

  async create(createEventDTO: RequestEventDTO) : Promise<ResponseEventDTO> {
    const [event] = await this
      .db
      .insert(schema.events)
      .values(createEventDTO)
      .returning()

    this.logger.info({ msg: 'Creating event', event });

    return event;
  }

  async update(eventId: string, updateEventDTO: RequestEventDTO): Promise<ResponseEventDTO> {
    const [event] = await this
      .db
      .update(schema.events)
      .set(updateEventDTO)
      .where(eq(schema.events.id, eventId))
      .returning();

    this.logger.info({ msg: 'Updating event', event });

    return event;
  }

  async delete(eventId: string): Promise<ResponseEventDTO> {
    const [event] = await this
      .db
      .delete(schema.events)
      .where(eq(schema.events.id, eventId))
      .returning();
    
    this.logger.info({ msg: 'Deleting event', event });
    
    return event;
  }
}