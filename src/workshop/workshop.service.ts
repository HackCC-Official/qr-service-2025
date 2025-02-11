import { Inject, Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { PG_CONNECTION } from "src/constants";
import { schema } from "src/drizzle/schema";
import { RequestWorkshopDTO } from "./request-workshop.dto";
import { ResponseWorkshopDTO } from "./response-workshop.dto";

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

  async findById(id: string): Promise<ResponseWorkshopDTO> {
    return await this.db
      .query
      .workshops
      .findFirst({ where: eq(schema.workshops.id, id) })
  }

  async create(createWorkshopDTO: RequestWorkshopDTO): Promise<ResponseWorkshopDTO> {
    const [workshop] = await this
      .db
      .insert(schema.workshops)
      .values(createWorkshopDTO)
      .returning();

    this.logger.info({ msg: 'Creating workshop', workshop })

    return workshop;
  }

  async update(workshopId: string, updateWorkshopDTO: RequestWorkshopDTO): Promise<ResponseWorkshopDTO> {
    const [workshop] = await this
      .db
      .update(schema.workshops)
      .set(updateWorkshopDTO)
      .where(eq(schema.workshops.id, workshopId))
      .returning()

    this.logger.info({ msg: 'Updating workshop', workshop })

    return workshop
  }

  async delete(workshopId: string) {
    const [workshop] = await this
      .db
      .delete(schema.workshops)
      .where(eq(schema.workshops.id, workshopId))
      .returning()

    this.logger.info({ msg: 'Updating workshop', workshop })

    return workshop;
  }
}