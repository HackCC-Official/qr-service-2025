import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from "@nestjs/common";
import { EventService } from "./event.service";
import { RequestEventDTO } from "src/drizzle/schema/event";
import { EventQuery } from "./event-query.type";

@Controller('events')
export class EventController {
  constructor(
    private eventService: EventService
  ) {}

  @Get()
  findAll(
    @Query() { date } : EventQuery
  ) {
    if (date) return this.eventService.findByDate(date);
    return this.eventService.findAll();
  }

  @Get(":event_id")
  findById(
    @Param('event_id') id: string
  ) {
    return this.eventService.findById(id);
  }

  @Post()
  create(
    @Body() createEventDTO: RequestEventDTO
  ) {
    return this.eventService.create(createEventDTO);
  }

  @Put(":event_id")
  update(
    @Param('event_id') id: string,
    @Body() updateEventDTO: RequestEventDTO
  ) {
    return this.eventService.update(id, updateEventDTO);
  }

  @Delete(":event_id")
  delete(
    @Param('event_id') id: string
  ) {
    return this.eventService.delete(id);
  }
}