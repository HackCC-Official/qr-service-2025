import { Module } from "@nestjs/common";
import { AccountModule } from "src/account/account.module";
import { DrizzleModule } from "src/drizzle/drizzle.module";
import { WorkshopOrganizerService } from "./workshop-organizer.service";
import { WorkshopModule } from "src/workshop/workshop.module";

@Module({
  imports: [DrizzleModule, WorkshopModule, AccountModule],
  providers: [WorkshopOrganizerService]
})
export class WorkshopOrganizerModule {}