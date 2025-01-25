import { Inject, Injectable } from "@nestjs/common";
import { MinioModule } from "src/minio-s3/minio.module";
import * as QRCode from "qrcode";
import { MinioService } from "src/minio-s3/minio.service";
import { PG_CONNECTION } from "src/constants";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { schema } from "src/drizzle/schema";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { eq } from "drizzle-orm";

@Injectable()
export class QRService {
  constructor(
    @Inject(PG_CONNECTION)
    private db: NodePgDatabase<typeof schema>,
    @InjectPinoLogger(QRService.name)
    private readonly logger: PinoLogger,
    private minioService: MinioService,
  ) {}

  async findById(id: string) {
    return this.db
      .query
      .accountQRs
      .findFirst({ where: eq(schema.events.id, id) });
  }

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