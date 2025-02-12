import { Inject, Injectable } from "@nestjs/common";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { PG_CONNECTION } from "src/constants";
import { schema } from "src/drizzle/schema";
import { WorkshopAttendanceQueryParamDTO } from "./wrokshop-attendance-query-param.dto";
import { and, eq } from "drizzle-orm";

@Injectable()
export class WorkshopAttendanceService {
  constructor(
    @Inject(PG_CONNECTION)
    private db: NodePgDatabase<typeof schema>,
    @InjectPinoLogger(WorkshopAttendanceService.name)
    private readonly logger: PinoLogger,
  ) {}

  async findAll(query: WorkshopAttendanceQueryParamDTO) {
    return this
      .db
      .query
      .workshop_attendances
      .findMany({
        where: and(
          eq(schema.workshop_attendances.account_id, query.account_id),
          eq(schema.workshop_attendances.workshop_id, query.workshop_id),
          eq(schema.workshop_attendances.event_id, query.event_id)
        )
      })
  }
}