import { Module } from "@nestjs/common";
import { NestMinioModule } from "nestjs-minio";
import { MinioService } from "./minio.service";

@Module({
  imports: [
    NestMinioModule.register({
      isGlobal: true,
      useSSL: process.env.MINIO_USE_SSL === 'true',
      endPoint: process.env.MINIO_ENDPOINT,
      port: Number(process.env.MINIO_PORT),
      accessKey: process.env.MINIO_ACCESS_KEY,
      secretKey: process.env.MINIO_ACCESS_SECRET,
    })
  ],
  providers: [MinioService],
  exports: [MinioService]
})
export class MinioModule {}