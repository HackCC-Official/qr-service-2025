import { ApiProperty } from "@nestjs/swagger";
import { AccountDTO } from "src/account/account.dto";

export class ResponseProgressDTO {
  @ApiProperty({
     example: '5075afd2-6880-44cc-adf6-032b3abd92d7'
  })
  id: string;

  @ApiProperty({
    example:  {
      "id": "64ae0549-b038-44ce-aea4-089a50888290",
      "email": "test@gmail.com",
      "password": "test",
      "roles": "{\"USER\",\"ORGANIZER\"}",
      "createdAt": "2025-01-30T07:03:08.307Z",
      "deletedAt": null
    },
  })
  account: AccountDTO;

  @ApiProperty({
    example: '100'
  })
  points: number;
}