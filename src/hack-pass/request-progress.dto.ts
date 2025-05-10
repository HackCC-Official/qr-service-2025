import { ApiProperty } from "@nestjs/swagger";

export class RequestMealProgressDTO {
  @ApiProperty({
    example: '83ae3a48-1d04-45ea-9f39-dbcad5cbab0c'
  })
  id: string;

  @ApiProperty({
    example: '9ad96ebd-c6e4-41a1-9863-5e876e30fb92'
  })
  account_id: string;

  @ApiProperty({
    example: '100'
  })
  points: number;
}