import { Body, Controller, Get, Param, Post, Req } from "@nestjs/common";
import { EventService } from "./event.provider";
import { RequestEventDTO } from "src/drizzle/schema/event";

@Controller('events')
export class EventController {
  constructor(
    private eventService: EventService
  ) {}

  @Get()
  findAll() {
    return this.eventService.findAll();
  }

  @Get(":id")
  findById(
    @Param('id') id: string
  ) {
    return this.eventService.findById(id);
  }

  @Post()
  create(
    @Body() createEventDTO: RequestEventDTO
  ) {
    return this.eventService.create(createEventDTO);
  }
}