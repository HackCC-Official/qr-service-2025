import { Module } from "@nestjs/common";
import { EventController } from "./event.controller";

@Module({
  providers: [],
  controllers: [EventController],
})
export class EventModule {}