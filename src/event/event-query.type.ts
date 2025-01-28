import { ApiPropertyOptional } from "@nestjs/swagger";

export class EventQuery {
  @ApiPropertyOptional()
  date: string;
}