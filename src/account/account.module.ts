import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { AccountService } from "./account.service";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [AccountService],
  exports: [AccountService]
})
export class AccountModule {}