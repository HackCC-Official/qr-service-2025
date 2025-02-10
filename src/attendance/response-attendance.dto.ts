import { ApiProperty } from "@nestjs/swagger";
import { AttendanceSelect, AttendanceStatus } from "src/drizzle/schema/attendance";

export class ResponseAttendanceDTO implements AttendanceSelect {
  @ApiProperty({
    example: 'PRESENT'
  })
  status: AttendanceStatus;
  @ApiProperty({
    example: '593fe4f9-ffae-481e-9e41-58a981114cb3'
  })
  id: string;
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