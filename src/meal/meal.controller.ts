import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { RequestMealDTO } from "./request-meal.dto";
import { ApiBody, ApiOperation, ApiQuery } from "@nestjs/swagger";
import { ResponseMealDTO } from "./response-meal.dto";
import { MealService } from "./meal.service";
import { ResponseMealAccountDTO } from "./response-meal-account.dto";
import { MealQueryParamDTO } from "./meal-query-param.dto";

@Controller('meals')
export class MealController {
  constructor(
    private mealService: MealService
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get users by event_id and mealStatus (if empty, then get user with unclaimed meals)'})
  @ApiQuery({
    required: true,
    name: 'event_id',
    description: 'the ID For the Event'
  })
  @ApiQuery({
    required: false,
    name: 'mealStatus',
    description: 'the meal status/type we want to check for. Do not set if we want to track unclaimed meals for current meal status (BREAKFAST, LUNCH, DINNER)'
  })
  async getUserByEventIdAndMealStatus(
    @Query() query: MealQueryParamDTO
  ): Promise<ResponseMealAccountDTO[]> {
    return this.mealService.findUsersByEventIDAndStatus(query)
  }


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