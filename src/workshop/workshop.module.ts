import { Module } from "@nestjs/common";
import { DrizzleModule } from "src/drizzle/drizzle.module";
import { WorkshopService } from "./workshop.service";
import { WorkshopController } from "./workshop.controller";
import { AccountModule } from "src/account/account.module";

@Module({
  imports: [DrizzleModule, AccountModule],
  providers: [WorkshopService],
  controllers: [WorkshopController],
  exports: [WorkshopService]
})
export class WorkshopModule {}