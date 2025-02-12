import { ApiProperty } from "@nestjs/swagger";
import { WorkshopAttendanceSelect } from "src/drizzle/schema/workshop";

export class ResponseWorkshopAttendanceDTO implements WorkshopAttendanceSelect {
  @ApiProperty({
    example: '87492ae0-39e4-45e8-956c-b6aa4eecee22'
  })
  id: string;
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
  @ApiProperty({
    example: '2025-03-21 08:45:45'
  })
  checkedInAt: string;
}