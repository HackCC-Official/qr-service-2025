import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ApplicationConsumerService } from "./application-consumer.service";
import { QRCodeModule } from "src/qr-code/qr-code.module";

@Module({
  imports: [ConfigModule, QRCodeModule],
  providers: [ApplicationConsumerService],
  exports: [ApplicationConsumerService],
})
export class ApplicationConsumerModule {}