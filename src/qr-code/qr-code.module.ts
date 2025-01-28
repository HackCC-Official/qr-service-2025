import { Module } from "@nestjs/common";
import { MinioModule } from "src/minio-s3/minio.module";
import { QRCodeService } from "./qr-code.service";
import { QrCodeController } from "./qr-code.controller";
import { DrizzleModule } from "src/drizzle/drizzle.module";

@Module({
  imports: [MinioModule, DrizzleModule],
  providers: [QRCodeService],
  controllers: [QrCodeController],
  exports: [QRCodeService]
})
export class QRCodeModule {}