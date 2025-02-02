import { Module } from "@nestjs/common";
import { EventModule } from "src/event/event.module";
import { AttendanceController } from "./attendance.controller";
import { AttendanceService } from "./attendance.service";
import { DrizzleModule } from "src/drizzle/drizzle.module";
import { HttpModule } from '@nestjs/axios'

@Module({
  imports: [DrizzleModule, EventModule],
  providers: [AttendanceService],
  controllers: [AttendanceController]
})
export class AttendanceModule {}