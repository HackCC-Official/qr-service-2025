import { ApiProperty } from "@nestjs/swagger";
import { AccountDTO } from "src/account/account.dto";
import { ActivityOrigin } from "src/drizzle/schema/hack-pass";

export class ResponseActivityAccountDTO {
  @ApiProperty({
    example: '767e7d36-4dab-4afc-b299-d63a855c72b5'
  })
  id: string;

  @ApiProperty({
    example: 'Wow Quest A'
  })
  title: string;

  @ApiProperty({
    example: 'Congrats on doing quest A'
  })
  message: string;

  @ApiProperty({
    example: 10
  })
  reward: number;

  @ApiProperty({
    example: ActivityOrigin.ATTENDANCE
  })
  origin: ActivityOrigin;

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
    example: "2025-01-30T07:03:08.307Z"
  })
  rewardedAt: string;
}