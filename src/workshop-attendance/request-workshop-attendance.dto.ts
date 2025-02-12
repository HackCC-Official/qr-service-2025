import { ApiProperty } from "@nestjs/swagger";
import { WorkshopInsert } from "src/drizzle/schema/workshop";

export class ResponseWorkshopAttendance implements WorkshopInsert {
  @ApiProperty({
    example: 'cdbbdbe3-da01-47c1-8225-6a7d359a2365'
  })
  account_id: string;
  @ApiProperty({
    example: '7b7b2214-ecad-48e5-b4f1-1558fb8d53f0'
  })
  event_id: string;
  @ApiProperty({
    example: '34b581d7-aac0-4d14-b115-ccb36bf462a2'
  })
  workshop_id: string;
}