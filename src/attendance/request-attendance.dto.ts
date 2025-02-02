import { ApiProperty } from "@nestjs/swagger";
import { AttendanceInsert, AttendanceStatus } from "src/drizzle/schema/attendance";

export class RequestAttendanceDTO implements AttendanceInsert {
  @ApiProperty({
    example: 'PRESENT'
  })
  status: AttendanceStatus;
  @ApiProperty({
    example: 'a4462a8f-aa76-48c1-afd2-ea00f149360b'
  })
  account_id: string;
  @ApiProperty({
    example: '7f8571d7-86dc-410e-9563-9e81609cf34d'
  })
  event_id: string;
  @ApiProperty({
    example: '2025-03-21 08:45:45'
  })
  checkedInAt: string;
}