import { Module } from "@nestjs/common";
import { EventModule } from "src/event/event.module";

@Module({
  imports: [EventModule],
  providers: [],
  controllers: []
})
export class AttendanceModule {}