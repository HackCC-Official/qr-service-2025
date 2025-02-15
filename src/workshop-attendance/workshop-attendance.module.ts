import { Module } from "@nestjs/common";
import { AccountModule } from "src/account/account.module";
import { DrizzleModule } from "src/drizzle/drizzle.module";
import { EventModule } from "src/event/event.module";
import { WorkshopModule } from "src/workshop/workshop.module";
import { WorkshopAttendanceService } from "./workshop-attendance.service";
import { WorkshopAttendanceController } from "./workshop-attendance.controller";

@Module({
  imports: [DrizzleModule, AccountModule, EventModule, WorkshopModule],
  providers: [WorkshopAttendanceService],
  controllers: [WorkshopAttendanceController]
})
export class WorkshopAttendanceModule {}