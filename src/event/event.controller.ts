import { Controller, Get } from "@nestjs/common";

@Controller('events')
export class EventController {
  @Get()
  findAll(): string {
    return "test"
  }
}