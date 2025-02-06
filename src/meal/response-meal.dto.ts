import { ApiProperty } from "@nestjs/swagger";
import { MealSelect, MealType } from "src/drizzle/schema/meal";

export class ResponseMealDTO implements MealSelect {
  @ApiProperty({
    example: 'd9a4fada-257f-4e3f-9b1d-acee8812e60e'
  })
  id: string;
  @ApiProperty({
    example: 'c671426f-f0d4-4cba-aa6a-e5c094644687'
  })
  account_id: string;

  @ApiProperty({
    example: 'f0d9690d-85a1-4473-ab5c-0f08fc228b18'
  })
  event_id: string;
  
  @ApiProperty({
    example: 'DINNER'
  })
  mealType: MealType;
  @ApiProperty({
    example: '2025-03-21 08:45:45'
  })
  checkedInAt: string;
}