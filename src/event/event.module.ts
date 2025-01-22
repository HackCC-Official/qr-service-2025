import { Logger, Module } from "@nestjs/common";
import { EventController } from "./event.controller";
import { EventService } from "./event.provider";
import { DrizzleModule } from "src/drizzle/drizzle.module";

@Module({
  imports: [DrizzleModule],
  providers: [EventService],
  controllers: [EventController],
})
export class EventModule {}