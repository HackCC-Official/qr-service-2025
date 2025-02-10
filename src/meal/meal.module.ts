import { Module } from "@nestjs/common";
import { AccountModule } from "src/account/account.module";
import { DrizzleModule } from "src/drizzle/drizzle.module";
import { EventModule } from "src/event/event.module";
import { MealService } from "./meal.service";
import { MealController } from "./meal.controller";

@Module({
  imports: [DrizzleModule, EventModule, AccountModule],
  providers: [MealService],
  controllers: [MealController],
})
export class MealModule {}