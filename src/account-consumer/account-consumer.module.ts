import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AccountConsumerService } from "./account-consumer.service";
import { QRModule } from "src/qr-code/qr-code.module";

@Module({
  imports: [ConfigModule, QRModule],
  providers: [AccountConsumerService],
  exports: [AccountConsumerService],
})
export class AccountConsumerModule {}