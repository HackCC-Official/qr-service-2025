import { Inject, Injectable } from "@nestjs/common";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { PG_CONNECTION } from "src/constants";
import { schema } from "src/drizzle/schema";
import { WorkshopAttendanceQueryParamDTO } from "./wrokshop-attendance-query-param.dto";
import { and, eq } from "drizzle-orm";
import { RequestWorkshopAttendanceDTO } from "./request-workshop-attendance.dto";
import { ResponseWorkshopAttendanceDTO } from "./response-workshop-attendance.dto";
import { AccountService } from "src/account/account.service";
import { EventService } from "src/event/event.service";
import { WorkshopService } from "src/workshop/workshop.service";

@Injectable()
export class WorkshopAttendanceService {
  constructor(
    @Inject(PG_CONNECTION)
    private db: NodePgDatabase<typeof schema>,
    @InjectPinoLogger(WorkshopAttendanceService.name)
    private readonly logger: PinoLogger,
    private workshopService: WorkshopService,
    private eventService: EventService,
    private accountService: AccountService
  ) {}

  async findAll(query: WorkshopAttendanceQueryParamDTO) {

    return await this
      .db
      .query
      .workshop_attendances
      .findMany({
        where: (workshop_attendances, { eq, or }) => {
          const conditions = [];

          if (query?.account_id) {
            conditions.push(eq(workshop_attendances.account_id, query.account_id));
          }
      
          if (query?.workshop_id) {
            conditions.push(eq(workshop_attendances.workshop_id, query.workshop_id));
          }
      
          if (query?.event_id) {
            conditions.push(eq(schema.workshop_attendances.event_id, query.event_id));
          }
      
          // If no conditions are provided, return undefined (no filtering)
          return conditions.length > 0 ? and(...conditions) : undefined;
        },
      })
  }

  async findById(id: string): Promise<ResponseWorkshopAttendanceDTO> {
    return this
      .db
      .query
      .workshop_attendances
      .findFirst({
        where: eq(schema.workshop_attendances.account_id, id)
      })
  }

  async takeAttendance(requestWorkshopAttendanceDTO: RequestWorkshopAttendanceDTO) {
    const workshop = await this.workshopService.findById(requestWorkshopAttendanceDTO.workshop_id)
    
    if (!workshop) {
      this.logger.error("Workshop ID " + requestWorkshopAttendanceDTO.workshop_id + " doesn't exist.")
      throw new Error("Workshop ID " + requestWorkshopAttendanceDTO.workshop_id + " doesn't exist.");
    }

    const event = await this.eventService.findById(requestWorkshopAttendanceDTO.event_id);

    if (!event) {
      this.logger.error("Event ID " + requestWorkshopAttendanceDTO.event_id + " doesn't exist.")
      throw new Error("Eventp ID " + requestWorkshopAttendanceDTO.event_id + " doesn't exist.");
    }

    const account = await this.accountService.findById(requestWorkshopAttendanceDTO.account_id);

    if (!account) {
      this.logger.error("Account ID " + requestWorkshopAttendanceDTO.account_id + " doesn't exist.")
      throw new Error("Account ID " + requestWorkshopAttendanceDTO.account_id + " doesn't exist.");
    }

    const workshopAttendanceDTO = {
      workshop_id: requestWorkshopAttendanceDTO.workshop_id,
      event_id: requestWorkshopAttendanceDTO.event_id,
      account_id: requestWorkshopAttendanceDTO.account_id,
      checkedInAt: (new Date()).toISOString(),
    }

    const [workshop_attendance] = await this.db
      .insert(schema.workshop_attendances)
      .values(workshopAttendanceDTO)
      .returning();

    this.logger.info("Taking workshop attendnace", workshop_attendance);

    return workshop_attendance;
  }
}