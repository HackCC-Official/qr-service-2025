import { Inject, Injectable } from "@nestjs/common";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { PG_CONNECTION } from "src/constants";
import { schema } from "src/drizzle/schema";
import { ResponseAttendanceDTO } from "./response-attendance.dto";
import { eq } from "drizzle-orm";
import { RequestAttendanceDTO } from "./request-attendance.dto";
import { AttendanceStatus } from "src/drizzle/schema/attendance";
import { EventService } from "src/event/event.service";
import { HttpService } from "@nestjs/axios";

@Injectable()
export class AttendanceService {
  constructor(
    @Inject(PG_CONNECTION)
    private db: NodePgDatabase<typeof schema>,
    @InjectPinoLogger(AttendanceService.name)
    private readonly logger: PinoLogger,
    private eventService: EventService,
  ) {}

  async findAll() {
    return await this.db
      .query
      .attendances
      .findMany();
  }

  async findById(id: string) : Promise<ResponseAttendanceDTO> {
    return this.db
      .query
      .attendances
      .findFirst({ where: eq(schema.events.id, id) });
  }

  async takeAttendance(requestAttendanceDTO: RequestAttendanceDTO): Promise<ResponseAttendanceDTO> {
    const attendanceDTO = {
      event_id: requestAttendanceDTO.event_id,
      account_id: requestAttendanceDTO.account_id,
      checkedInAt: (new Date()).toISOString(),
      status: AttendanceStatus.PRESENT
    }

    const event = await this.eventService.findById(requestAttendanceDTO.event_id);

    if (!event) {
      throw new Error("Event ID " + requestAttendanceDTO.event_id + " doesn't exist.");
    }

    const checkedInAt = new Date(attendanceDTO.checkedInAt)
    const startingTime = new Date(event.startingTime);
    const lateTime = new Date(event.lateTime);
    const endingTime = new Date(event.endingTime);

    if (startingTime <= checkedInAt && checkedInAt < lateTime) {
      attendanceDTO.status = AttendanceStatus.PRESENT;
    } else if (lateTime <= checkedInAt && checkedInAt <= endingTime) {
      attendanceDTO.status = AttendanceStatus.LATE;
    } else {
      if (checkedInAt <= startingTime) {
        throw new Error("Attempting to check in before starting time")
      } else {
        throw new Error("Attempting to check after ending time")
      }
    }

    const [attendance] = await this.db
      .insert(schema.attendances)
      .values(attendanceDTO)
      .returning()

    this.logger.info({ msg: 'Hacker checked in', attendance })

    return attendance;
  }
}