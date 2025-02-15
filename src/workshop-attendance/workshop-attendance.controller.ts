import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { WorkshopAttendanceService } from "./workshop-attendance.service";
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from "@nestjs/swagger";
import { WorkshopAttendanceQueryParamDTO } from "./wrokshop-attendance-query-param.dto";
import { ResponseWorkshopAttendanceDTO } from "./response-workshop-attendance.dto";
import { RequestWorkshopAttendanceDTO } from "./request-workshop-attendance.dto";

@ApiTags('Workshop Attendance')
@Controller('workshop-attendances')
export class WorkshopAttendanceController {
  constructor(
    private workshopAttendanceService: WorkshopAttendanceService
  ) {}

  @Get()
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
  findAll(query: WorkshopAttendanceQueryParamDTO) {
    return this.workshopAttendanceService.findAll(query);
  }

  @Get(':workshop_attendance_id')
  @ApiOperation({
    summary: 'Finds a single Workshop Attendance by workshop_attendance_id'
  })
  @ApiParam({
    description: 'ID of existing Workshop Attendance',
    name: 'workshop_attendance_id'
  })
  findById(
    @Param('workshop_attendance_id') id: string
  ): Promise<ResponseWorkshopAttendanceDTO> {
    return this.workshopAttendanceService.findById(id)
  }

  @Post()
  @ApiOperation({ summary: 'Take a hacker\'s attendance at a workshop'})
  create(
    @Body() requestWorkshopAttendanceDTO: RequestWorkshopAttendanceDTO
  ): Promise<ResponseWorkshopAttendanceDTO> {
    return this.workshopAttendanceService.takeAttendance(requestWorkshopAttendanceDTO)
  }
}