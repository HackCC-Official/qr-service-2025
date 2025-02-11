import { Module } from "@nestjs/common";
import { DrizzleModule } from "src/drizzle/drizzle.module";
import { WorkshopService } from "./workshop.service";
import { WorkshopController } from "./workshop.controller";

@Module({
  imports: [DrizzleModule],
  providers: [WorkshopService],
  controllers: [WorkshopController]
})
export class WorkshopModule {}