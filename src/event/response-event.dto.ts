import { ApiProperty } from "@nestjs/swagger";
import { EventInsert } from "src/drizzle/schema/event";

export class RequestEventDTO implements EventInsert {
  @ApiProperty({
    example: "2025-03-21",
  })
  date: string;
  @ApiProperty({
    example: "2025-03-21 08:00:00",
  })
  startingTime: string;
  @ApiProperty({
    example: "2025-03-21 12:00:00",
  })
  lateTime: string;
  @ApiProperty({
    example: "2025-03-21 17:00:00",
  })
  endingTime: string;
  @ApiProperty()
  active: boolean;
  @ApiProperty()
  breakfast: boolean;
  @ApiProperty()
  lunch: boolean;
  @ApiProperty()
  dinner: boolean;
}