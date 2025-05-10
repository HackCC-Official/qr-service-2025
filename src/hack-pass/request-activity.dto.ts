import { ApiProperty } from "@nestjs/swagger";
import { ActivityOrigin } from "src/drizzle/schema/hack-pass";

export class RequestActivityAccountDTO {
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
    example: '5075afd2-6880-44cc-adf6-032b3abd92d7'
  })
  account_id: string;

  @ApiProperty({
    example: "2025-01-30T07:03:08.307Z"
  })
  rewardedAt: string;
}