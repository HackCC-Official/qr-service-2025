import { Module } from "@nestjs/common";
import { MinioModule } from "src/minio-s3/minio.module";
import { QRService } from "./qr.service";
import { QrController } from "./qr.controller";
import { DrizzleModule } from "src/drizzle/drizzle.module";

@Module({
  imports: [MinioModule, DrizzleModule],
  providers: [QRService],
  controllers: [QrController]
})
export class QRModule {}