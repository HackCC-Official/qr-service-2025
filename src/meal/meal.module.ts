import { Module } from "@nestjs/common";
import { AccountModule } from "src/account/account.module";
import { DrizzleModule } from "src/drizzle/drizzle.module";
import { EventModule } from "src/event/event.module";

@Module({
  imports: [DrizzleModule, EventModule, AccountModule],
  providers: [],
  controllers: [],
})
export class MealModule {}