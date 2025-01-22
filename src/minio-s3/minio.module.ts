import { Module } from "@nestjs/common";
import { NestMinioModule } from "nestjs-minio";

@Module({
  imports: [
    NestMinioModule.register({
      isGlobal: true,
      useSSL: false,
      endPoint: process.env.MINIO_ENDPOINT,
      port: Number(process.env.MINIO_PORT),
      accessKey: process.env.MINIO_ACCESS_KEY,
      secretKey: process.env.MINIO_ACCESS_SECRET,
    })
  ]
})
export class MinioModule {}