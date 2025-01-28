import { Module } from "@nestjs/common";
import { MinioModule } from "src/minio-s3/minio.module";
import { QRService } from "./qr-code.service";
import { QrController } from "./qr-code.controller";
import { DrizzleModule } from "src/drizzle/drizzle.module";

@Module({
  imports: [MinioModule, DrizzleModule],
  providers: [QRService],
  controllers: [QrController],
  exports: [QRService]
})
export class QRModule {}