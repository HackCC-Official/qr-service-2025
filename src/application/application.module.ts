import { HttpModule } from "@nestjs/axios";
import { ConfigModule } from "@nestjs/config";
import { ApplicationService } from "./application.service";
import { Module } from "@nestjs/common";
import { AttendeeGuard } from "src/auth/attendee.guard";

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [AttendeeGuard, ApplicationService],
  exports: [AttendeeGuard, ApplicationService]
})
export class ApplicationModule {}