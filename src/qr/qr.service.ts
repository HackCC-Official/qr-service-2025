import { Injectable } from "@nestjs/common";
import { MinioModule } from "src/minio-s3/minio.module";
import * as QRCode from "qrcode";
import { MinioService } from "src/minio-s3/minio.service";

@Injectable()
export class QRService {
  constructor(
    private minioService: MinioService,
  ) {}

  generateFilename(userId: string) {
    const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
    return `${userId}_${timestamp}.png`;
}

  async generateQRCode(userId: string): Promise<string> {
    const qrCodeBuffer: Buffer = await QRCode.toBuffer(userId);
    const qrCodeFilename = '/qr-codes/' + this.generateFilename(userId);

    await this.minioService.uploadImg(qrCodeFilename, qrCodeBuffer);

    return process.env.MINIO_BUCKET_NAME + qrCodeFilename;
  }
}