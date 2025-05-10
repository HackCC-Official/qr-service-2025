import { Module } from "@nestjs/common";
import { AccountModule } from "src/account/account.module";
import { ProgressService } from "./progress.service";
import { DrizzleModule } from "src/drizzle/drizzle.module";

@Module({
  imports: [DrizzleModule, AccountModule],
  providers: [ProgressService],
  controllers: []
})
export class HackPassModule {}