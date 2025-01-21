import { Controller, Get } from "@nestjs/common";
import { EventService } from "./event.provider";

@Controller('events')
export class EventController {
  constructor(
    private eventService: EventService
  ) {}

  @Get()
  findAll() {
    return this.eventService.findAll()
  }
}