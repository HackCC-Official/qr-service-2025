import { Body, Controller, Get, Param, Post, Query, UseGuards } from "@nestjs/common";
import { AttendanceService } from "./attendance.service";
import { ApiOperation, ApiParam, ApiQuery } from "@nestjs/swagger";
import { ResponseAttendanceDTO } from "./response-attendance.dto";
import { RequestAttendanceDTO } from "./request-attendance.dto";
import { AttendanceQueryParamDTO } from "./attendance-query-param.dto";
import { JwtAuthGuard } from "src/auth/jwt.auth.guard";
import { AccountRoles } from "src/auth/role.enum";
import { Roles } from "src/auth/roles.decorator";
import { RolesGuard } from "src/auth/roles.guard";

@Controller('attendances')
export class AttendanceController {
  constructor(
    private attendanceService: AttendanceService
  ) {}
  
  @ApiOperation({ summary: 'Finds all Attendances' })
  @ApiQuery({
    required: false,
    name: 'event_id',
    description: 'the ID For the Event'
  })
  @ApiQuery({
    required: false,
    name: 'status',
    description: 'the attendance status we want to find (ALL, ABSENT, PRESENT, LATE)'
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([AccountRoles.ADMIN, AccountRoles.ORGANIZER])
  @Get()
  async findAll(
    @Query() query?: AttendanceQueryParamDTO
  ) {
    return await this.attendanceService.findAll(query);
  }

  @ApiOperation({ summary: 'Finds a single Attendance by attendance_id'})
  @ApiParam({
    description: 'ID of existing attendance',
    name: 'attendance_id'
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([AccountRoles.USER, AccountRoles.JUDGE, AccountRoles.ADMIN, AccountRoles.ORGANIZER])
  @Get(':attendance_id')
  findById(
    @Param('attendance_id') id: string,
  ) : Promise<ResponseAttendanceDTO> {
    return this.attendanceService.findById(id);
  }

  @ApiOperation({ summary: 'Take a hacker\'s attendance' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([AccountRoles.ADMIN, AccountRoles.ORGANIZER])
  @Post()
  async takeAttendance(
    @Body() requestAttendanceDTO: RequestAttendanceDTO,
  ): Promise<ResponseAttendanceDTO> {
    return await this.attendanceService.takeAttendance(requestAttendanceDTO);
  }
}