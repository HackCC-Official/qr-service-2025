import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AccountConsumerService } from "./account-consumer.service";
import { QRCodeModule } from "src/qr-code/qr-code.module";

@Module({
  imports: [ConfigModule, QRCodeModule],
  providers: [AccountConsumerService],
  exports: [AccountConsumerService],
})
export class AccountConsumerModule {}