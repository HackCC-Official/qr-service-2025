import { ApiProperty } from "@nestjs/swagger";
import { MealInsert, MealType } from "src/drizzle/schema/meal";

export class RequestMealDTO implements MealInsert {
  @ApiProperty({
    example: 'c671426f-f0d4-4cba-aa6a-e5c094644687'
  })
  account_id: string;

  @ApiProperty({
    example: 'f0d9690d-85a1-4473-ab5c-0f08fc228b18'
  })
  event_id: string;
}