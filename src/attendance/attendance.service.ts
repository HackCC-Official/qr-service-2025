import { Inject, Injectable } from "@nestjs/common";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { PG_CONNECTION } from "src/constants";
import { schema } from "src/drizzle/schema";
import { ResponseAttendanceDTO } from "./response-attendance.dto";
import { and, eq, not, or } from "drizzle-orm";
import { RequestAttendanceDTO } from "./request-attendance.dto";
import { AttendanceStatus } from "src/drizzle/schema/attendance";
import { EventService } from "src/event/event.service";
import { AccountService } from "src/account/account.service";
import { AttendanceQueryParamDTO } from "./attendance-query-param.dto";
import { AccountDTO } from "src/account/account.dto";

@Injectable()
export class AttendanceService {
  constructor(
    @Inject(PG_CONNECTION)
    private db: NodePgDatabase<typeof schema>,
    @InjectPinoLogger(AttendanceService.name)
    private readonly logger: PinoLogger,
    private eventService: EventService,
    private accountService: AccountService
  ) {}

  async findAll(query?: AttendanceQueryParamDTO) {
    const whereConditions = [];

    if (query.status !== undefined && query.status !== AttendanceStatus.ABSENT && query.status !== AttendanceStatus.ALL) {
      whereConditions.push(eq(schema.attendances.status, query.status));
    } else if (query.status !== undefined && (query.status === AttendanceStatus.ABSENT || query.status === AttendanceStatus.ALL)) {
      whereConditions.push(
        or(
          eq(schema.attendances.status, AttendanceStatus.PRESENT),
          eq(schema.attendances.status, AttendanceStatus.LATE)
        )
      )
    }

    if (query.event_id !== undefined) {
      whereConditions.push(eq(schema.attendances.event_id, query.event_id));
    }

    const attendances = await this.db
    .query
    .attendances
    .findMany({
      where: whereConditions.length > 0 ? and(...whereConditions) : undefined })

    const account_ids = attendances.map(a => a.account_id) as string[]
    let accounts: AccountDTO[];

    if (query.status === AttendanceStatus.PRESENT || query.status === AttendanceStatus.LATE) {
      accounts = await this.accountService.batchFindById(account_ids);
    } else {
      accounts = await this.accountService.findAll();
    }

    if (query.status === AttendanceStatus.PRESENT || query.status === AttendanceStatus.LATE) {
      const account_map = {}

      for (const account of accounts) {
        account_map[account.id] = account;
      }

      return attendances.map((a) => {
        const account_id = a.account_id as string
        delete a.account_id
        return {
          ...a,
          account: account_map[account_id]
        }
      })
    } else if (query.status === AttendanceStatus.ALL) {
      const account_map = {}

      for (const account of accounts) {
        account_map[account.id] = account;
      }

      const attendedAccountSet = new Set();

      for (const account_id of account_ids) {
        attendedAccountSet.add(account_id);
      }

      const absentAccounts = accounts.filter(a => !attendedAccountSet.has(a.id))
      return [
        ...attendances.map((a) => {
          const account_id = a.account_id as string
          delete a.account_id
          return {
            ...a,
            account: account_map[account_id]
          }
        })
        ,
        ...absentAccounts.map(a => ({
          status: AttendanceStatus.ABSENT,
          id: a.id,
          account: a,
          event_id: query.event_id || '',
          checkedInAt: ''
        }))
      ]
    } else {
      const absentAccountSet = new Set();

      for (const account_id of account_ids) {
        absentAccountSet.add(account_id);
      }

      const validAccounts = accounts.filter(a => !absentAccountSet.has(a.id))
      
      return validAccounts.map(a => ({
        status: AttendanceStatus.ABSENT,
        id: a.id,
        account: a,
        event_id: query.event_id || '',
        checkedInAt: ''
      }))

    }
  }

  async findById(id: string) : Promise<ResponseAttendanceDTO> {
    const attendance = await this.db
      .query
      .attendances
      .findFirst({ where: eq(schema.attendances.event_id, id) });

    const account = await this.accountService.findById(attendance.account_id)

    delete attendance.account_id;

    return {
      ...attendance,
      account
    };
  }

  async findByEventIDAndAccountID(event_id: string, account_id: string) : Promise<ResponseAttendanceDTO | null> {
    const attendance = await this.db
      .query
      .attendances
      .findFirst({ where: and(eq(schema.attendances.event_id, event_id), eq(schema.attendances.account_id, account_id)) });
    
    if (!attendance) {
      return null;
    }

    const account = await this.accountService.findById(attendance.account_id)
    
    if (attendance) {
      delete attendance.account_id;
    }

    return {
      ...attendance,
      account
    };
  }

  async takeAttendance(requestAttendanceDTO: RequestAttendanceDTO): Promise<ResponseAttendanceDTO> {
    const event = await this.eventService.findById(requestAttendanceDTO.event_id);
    const account = await this.accountService.findById(requestAttendanceDTO.account_id)
    const attendanceExists = await this.findByEventIDAndAccountID(requestAttendanceDTO.event_id, requestAttendanceDTO.account_id)

    if (attendanceExists) {
      this.logger.error("Account with ID " + requestAttendanceDTO.account_id + " already checked in.");
      throw new Error("Account with ID " + requestAttendanceDTO.account_id + " already checked in.");
    }

    if (!event) {
      this.logger.error("Event ID " + requestAttendanceDTO.event_id + " doesn't exist.")
      throw new Error("Event ID " + requestAttendanceDTO.event_id + " doesn't exist.");
    }

    if (!account) {
      this.logger.error("Account ID " + requestAttendanceDTO.account_id + " doesn't exist.")
      throw new Error("Account ID " + requestAttendanceDTO.account_id + " doesn't exist.");
    }

    const attendanceDTO = {
      event_id: requestAttendanceDTO.event_id,
      account_id: requestAttendanceDTO.account_id,
      checkedInAt: (new Date()).toISOString(),
      status: AttendanceStatus.PRESENT
    }

    console.log(attendanceDTO)

    if (!this.eventService.isValidCheckInTime(attendanceDTO.checkedInAt, event)) {
      this.logger.info({ msg: 'Invalid attendance check in time for Account ID: ' + attendanceDTO.account_id, attendanceDTO, event })
      return;
    }

    const checkedInAt = new Date(attendanceDTO.checkedInAt);
    const startingTime = new Date(event.startingTime);
    const lateTime = new Date(event.lateTime);
    const endingTime = new Date(event.endingTime);

    if (startingTime <= checkedInAt && checkedInAt < lateTime) {
      attendanceDTO.status = AttendanceStatus.PRESENT;
    } else if (lateTime <= checkedInAt && checkedInAt <= endingTime) {
      attendanceDTO.status = AttendanceStatus.LATE;
    }

    const [attendance] = await this.db
      .insert(schema.attendances)
      .values(attendanceDTO)
      .returning()

    this.logger.info({ msg: 'Taking hacker attendance', attendance })

    delete attendance.account_id;

    return {
      ...attendance,
      account
    }
  }
}