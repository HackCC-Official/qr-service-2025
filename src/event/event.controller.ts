import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from "@nestjs/common";
import { EventService } from "./event.service";
import { RequestEventDTO } from "./response-event.dto";
import { ResponseEventDTO } from "./request-event.dto";
import { ApiBody, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";

@Controller('events')
export class EventController {
  constructor(
    private eventService: EventService
  ) {}

  @ApiOperation({ summary: 'Finds all Events' })
  @Get()
  async findAll() {
    return await this.eventService.findAll();
  }

  @ApiOperation({ summary: 'Finds an Event by a date (format: yyyy-mm-dd)'})
  @ApiParam({
    description: 'a date of type string (yyyy-mm-dd) that is used to retrieve a single event',
    name: "date"
  })
  @Get('/date/:date')
  async findByDateString(
    @Param('date') date: string
  ) : Promise<ResponseEventDTO> {
    return await this.eventService.findByDate(date);
  }

  @Get(":event_id")
  @ApiOperation({ summary: 'Finds a single event by events_id'})
  @ApiParam({
    description: 'ID of existing event',
    name: "event_id"
  })
  async findById(
    @Param('event_id') id: string
  ) : Promise<ResponseEventDTO> {
    return await this.eventService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Creates a new event that counts as an active date for the hackathon'})
  @ApiBody({
    description: "Event object that reflects a future active hackathon day",
    type: RequestEventDTO
  })
  async create(
    @Body() createEventDTO: RequestEventDTO
  ) : Promise<ResponseEventDTO> {
    return await this.eventService.create(createEventDTO);
  }

  @Put(":event_id")
  @ApiOperation({ summary: 'Updates an existing event'})
  @ApiParam({
    description: 'ID of existing event',
    name: "event_id"
  })
  async update(
    @Param('event_id') id: string,
    @Body() updateEventDTO: RequestEventDTO
  ) : Promise<ResponseEventDTO> {
    return await this.eventService.update(id, updateEventDTO)
  }

  @Delete(":event_id")
  @ApiOperation({ summary: 'Deletes an event' })
  @ApiParam({
    description: 'ID of existing event',
    name: "event_id"
  })
  async delete(
    @Param('event_id') id: string
  ) {
    return this.eventService.delete(id);
  }
}