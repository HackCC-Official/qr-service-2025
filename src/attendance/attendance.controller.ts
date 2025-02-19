import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { AttendanceService } from "./attendance.service";
import { ApiOperation, ApiParam, ApiQuery } from "@nestjs/swagger";
import { ResponseAttendanceDTO } from "./response-attendance.dto";
import { RequestAttendanceDTO } from "./request-attendance.dto";
import { AttendanceQueryParamDTO } from "./attendance-query-param.dto";

@Controller('attendances')
export class AttendanceController {
  constructor(
    private attendanceService: AttendanceService
  ) {}
  
  @Get()
  @ApiOperation({ summary: 'Finds all Attendances' })
  @ApiQuery({
    required: false,
    name: 'event_id',
    description: 'the ID For the Event'
  })
  @ApiQuery({
    required: false,
    name: 'status',
    description: 'the attendance status we want to find (ABSENT, PRESENT, LATE)'
  })
  async findAll(
    @Query() query?: AttendanceQueryParamDTO,
  ) {
    return await this.attendanceService.findAll(query);
  }

  @Get(':attendance_id')
  @ApiOperation({ summary: 'Finds a single Attendance by attendance_id'})
  @ApiParam({
    description: 'ID of existing attendance',
    name: 'attendance_id'
  })
  findById(
    @Param('attendance_id') id: string
  ) : Promise<ResponseAttendanceDTO> {
    return this.attendanceService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Take a hacker\'s attendance' })
  async takeAttendance(
    @Body() requestAttendanceDTO: RequestAttendanceDTO
  ): Promise<ResponseAttendanceDTO> {
    return await this.attendanceService.takeAttendance(requestAttendanceDTO);
  }
}