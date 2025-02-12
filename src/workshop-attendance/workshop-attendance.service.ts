import { Inject, Injectable } from "@nestjs/common";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { PG_CONNECTION } from "src/constants";
import { schema } from "src/drizzle/schema";

@Injectable()
export class WorkshopAttendanceService {
  constructor(
    @Inject(PG_CONNECTION)
    private db: NodePgDatabase<typeof schema>,
    @InjectPinoLogger(WorkshopAttendanceService.name)
    private readonly logger: PinoLogger,
  ) {}

  async findAll() {
    return this
      .db
      .query
      .workshop_attendances
      .findMany();
  }
}