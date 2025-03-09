import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { WorkshopAttendanceService } from "./workshop-attendance.service";
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { WorkshopAttendanceQueryParamDTO } from "./wrokshop-attendance-query-param.dto";
import { ResponseWorkshopAttendanceDTO } from "./response-workshop-attendance.dto";
import { RequestWorkshopAttendanceDTO } from "./request-workshop-attendance.dto";
import { JwtAuthGuard } from "src/auth/jwt.auth.guard";
import { AccountRoles } from "src/auth/role.enum";
import { Roles } from "src/auth/roles.decorator";
import { RolesGuard } from "src/auth/roles.guard";

@ApiTags('Workshop Attendance')
@Controller('workshop-attendances')
export class WorkshopAttendanceController {
  constructor(
    private workshopAttendanceService: WorkshopAttendanceService
  ) {}

  @ApiOperation({
    summary: 'Finds all Workshop Attendances'
  })
  @ApiQuery({
    required: false,
    name: 'event_id',
    description: 'the ID For the Event'
  })
  @ApiQuery({
    required: false,
    name: 'workshop_id',
    description: 'the ID For the Workshop'
  })
  @ApiQuery({
    required: false,
    name: 'account_id',
    description: 'the ID For the Account'
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([AccountRoles.USER, AccountRoles.JUDGE, AccountRoles.ADMIN, AccountRoles.ORGANIZER])
  @Get()
  findAll(query: WorkshopAttendanceQueryParamDTO) {
    return this.workshopAttendanceService.findAll(query);
  }

  @ApiOperation({
    summary: 'Finds a single Workshop Attendance by workshop_attendance_id'
  })
  @ApiParam({
    description: 'ID of existing Workshop Attendance',
    name: 'workshop_attendance_id'
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([AccountRoles.USER, AccountRoles.JUDGE, AccountRoles.ADMIN, AccountRoles.ORGANIZER])
  @Get(':workshop_attendance_id')
  findById(
    @Param('workshop_attendance_id') id: string
  ): Promise<ResponseWorkshopAttendanceDTO> {
    return this.workshopAttendanceService.findById(id)
  }

  @ApiOperation({ summary: 'Take a hacker\'s attendance at a workshop'})
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([AccountRoles.ADMIN, AccountRoles.ORGANIZER])
  @Post()
  create(
    @Body() requestWorkshopAttendanceDTO: RequestWorkshopAttendanceDTO,
  ): Promise<ResponseWorkshopAttendanceDTO> {
    return this.workshopAttendanceService.takeAttendance(requestWorkshopAttendanceDTO)
  }
}