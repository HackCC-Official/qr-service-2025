import { Module } from "@nestjs/common";
import { MinioModule } from "src/minio-s3/minio.module";
import { QRService } from "./qr.service";
import { QrController } from "./qr.controller";

@Module({
  imports: [MinioModule],
  providers: [QRService],
  controllers: [QrController]
})
export class QRModule {}