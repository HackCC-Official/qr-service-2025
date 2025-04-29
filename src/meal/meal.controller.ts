import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { RequestMealDTO } from "./request-meal.dto";
import { ApiBody, ApiOperation, ApiQuery } from "@nestjs/swagger";
import { ResponseMealDTO } from "./response-meal.dto";
import { MealService } from "./meal.service";
import { ResponseMealAccountDTO } from "./response-meal-account.dto";
import { MealQueryParamDTO } from "./meal-query-param.dto";
import { JwtAuthGuard } from "src/auth/jwt.auth.guard";
import { AccountRoles } from "src/auth/role.enum";
import { Roles } from "src/auth/roles.decorator";
import { RolesGuard } from "src/auth/roles.guard";

@Controller('meals')
export class MealController {
  constructor(
    private mealService: MealService
  ) {}

  @ApiOperation({ summary: 'Get accounts by event_id and mealType (if empty, then get user with unclaimed meals)'})
  @ApiQuery({
    required: true,
    name: 'event_id',
    description: 'the ID For the Event'
  })
  @ApiQuery({
    required: false,
    name: 'mealSType',
    description: 'the meal status/type we want to check for. Do not set if we want to track unclaimed meals for current meal status (BREAKFAST, LUNCH, DINNER)'
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([AccountRoles.USER, AccountRoles.JUDGE, AccountRoles.ADMIN, AccountRoles.ORGANIZER])
  @Get()
  async getAccountsByEventIDAndMealType(
    @Query() query: MealQueryParamDTO,
  ): Promise<ResponseMealAccountDTO[]> {
    return this.mealService.findAccountsByEventIDAndMealType(query)
  }

  @ApiOperation({ summary: 'Claim a meal for the hackathon participant'})
  @ApiBody({
    description: "Meal object",
    type: RequestMealDTO
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([AccountRoles.USER, AccountRoles.JUDGE, AccountRoles.ADMIN, AccountRoles.ORGANIZER])
  @Post()
  async claimMeal(
    @Body() requestMealDTO: RequestMealDTO,
  ): Promise<ResponseMealDTO> {
    return await this.mealService.claimMeal(requestMealDTO);
  }
}