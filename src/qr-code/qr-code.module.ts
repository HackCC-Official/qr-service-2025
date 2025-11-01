import { Module } from "@nestjs/common";
import { MinioModule } from "src/minio-s3/minio.module";
import { QRCodeService } from "./qr-code.service";
import { QrCodeController } from "./qr-code.controller";
import { DrizzleModule } from "src/drizzle/drizzle.module";
import { AccountModule } from "src/account/account.module";
import { ApplicationModule } from "src/application/application.module";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [HttpModule, MinioModule, DrizzleModule, AccountModule, ApplicationModule],
  providers: [QRCodeService],
  controllers: [QrCodeController],
  exports: [QRCodeService]
})
export class QRCodeModule {}