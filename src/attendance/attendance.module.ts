import { Module } from "@nestjs/common";
import { EventModule } from "src/event/event.module";
import { AttendanceController } from "./attendance.controller";
import { AttendanceService } from "./attendance.service";
import { DrizzleModule } from "src/drizzle/drizzle.module";
import { AccountModule } from "src/account/account.module";
import { HackPassModule } from "src/hack-pass/hack-pass.module";

@Module({
  imports: [DrizzleModule, EventModule, AccountModule, HackPassModule],
  providers: [AttendanceService],
  controllers: [AttendanceController]
})
export class AttendanceModule {}