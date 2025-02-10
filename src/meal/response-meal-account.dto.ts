import { ApiProperty } from "@nestjs/swagger";
import { AccountDTO } from "src/account/account.dto";
import { MealSelect, MealType } from "src/drizzle/schema/meal";

export class ResponseMealAccountDTO {
  @ApiProperty({
    example: 'd9a4fada-257f-4e3f-9b1d-acee8812e60e'
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