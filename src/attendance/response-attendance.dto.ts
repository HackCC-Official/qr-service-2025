import { ApiProperty } from "@nestjs/swagger";
import { AccountDTO } from "src/account/account.dto";
import { AttendanceSelect, AttendanceStatus } from "src/drizzle/schema/attendance";

export class ResponseAttendanceDTO {
  @ApiProperty({
    example: 'PRESENT'
  })
  status: AttendanceStatus;
  @ApiProperty({
    example: '593fe4f9-ffae-481e-9e41-58a981114cb3'
  })
  id: string;
  @ApiProperty({
    example: {
      id: 'e5c94298-068a-4759-b4c3-1f9d24d09a76',
      username: 'evan'
    }
  })
  account: AccountDTO;
  @ApiProperty({
    example: '7f8571d7-86dc-410e-9563-9e81609cf34d'
  })
  event_id: string;
  @ApiProperty({
    example: '2025-03-21 08:45:45'
  })
  checkedInAt: string;
  
}