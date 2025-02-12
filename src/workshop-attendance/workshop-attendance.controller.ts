import { Controller, Get } from "@nestjs/common";
import { WorkshopAttendanceService } from "./workshop-attendance.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags('Workshop Attendance')
@Controller('workshop-attendances')
export class WorkshopAttendanceController {
  constructor(
    private workshopAttendanceService: WorkshopAttendanceService
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Finds all workshop attendances'
  })
  findAll() {
    return this.workshopAttendanceService.findAll();
  }
}