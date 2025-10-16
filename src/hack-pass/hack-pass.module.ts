import { Module } from "@nestjs/common";
import { AccountModule } from "src/account/account.module";
import { ProgressService } from "./progress.service";
import { DrizzleModule } from "src/drizzle/drizzle.module";
import { ActivityService } from "./activity.service";
import { HackPassController } from "./hack-pass.controller";

@Module({
  imports: [DrizzleModule, AccountModule],
  providers: [ProgressService, ActivityService],
  controllers: [HackPassController],
  exports: [ActivityService]
})
export class HackPassModule {}