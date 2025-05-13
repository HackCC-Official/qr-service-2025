import { ApiProperty } from "@nestjs/swagger";

export class RequestMealProgressDTO {

  @ApiProperty({
    example: '9ad96ebd-c6e4-41a1-9863-5e876e30fb92'
  })
  account_id: string;

  @ApiProperty({
    example: '100'
  })
  points: number;
}