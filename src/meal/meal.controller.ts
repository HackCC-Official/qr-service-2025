import { Body, Controller, Post } from "@nestjs/common";
import { RequestMealDTO } from "./request-meal.dto";
import { ApiBody, ApiOperation } from "@nestjs/swagger";
import { ResponseMealDTO } from "./response-meal.dto";
import { MealService } from "./meal.service";

@Controller('meals')
export class MealController {
  constructor(
    private mealService: MealService
  ) {}

  @Post()
  @ApiOperation({ summary: 'Claim a meal for the hackathon participant'})
  @ApiBody({
    description: "Meal object",
    type: RequestMealDTO
  })
  async claimMeal(
    @Body() requestMealDTO: RequestMealDTO
  ): Promise<ResponseMealDTO> {
    return await this.mealService.claimMeal(requestMealDTO);
  }
}