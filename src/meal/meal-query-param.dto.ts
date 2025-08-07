import { MealType } from "src/drizzle/schema/meal";
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator'
export class MealQueryParamDTO {
  @IsUUID()
  @IsNotEmpty()
  event_id: string;

  @IsEnum(MealType)
  mealType?: MealType;
}