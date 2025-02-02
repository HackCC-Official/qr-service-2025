import { ApiProperty } from "@nestjs/swagger";
import { EventSelect } from "src/drizzle/schema/event";

export class ResponseEventDTO implements EventSelect {
  @ApiProperty({
    example: "2025-03-21",
  })
  date: string;
  @ApiProperty({
    example: "7d31a208-ff53-4a8e-960a-cb5b5276f2a8",
  })
  id: string;
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
