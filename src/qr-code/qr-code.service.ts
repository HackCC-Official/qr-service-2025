import { Inject, Injectable } from "@nestjs/common";
import * as QRCode from "qrcode";
import { MinioService } from "src/minio-s3/minio.service";
import { PG_CONNECTION } from "src/constants";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { schema } from "src/drizzle/schema";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { eq } from "drizzle-orm";
import { RequestAccountQRDTO } from "src/drizzle/schema/account-qr";

@Injectable()
export class QRCodeService {
  constructor(
    @Inject(PG_CONNECTION)
    private db: NodePgDatabase<typeof schema>,
    @InjectPinoLogger(QRCodeService.name)
    private readonly logger: PinoLogger,
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

  async findByAccountId(accountId: string) {
    return this.db
      .query
      .accountQRs
      .findFirst({ where: eq(schema.accountQRs.account_id, accountId) });
  }

  async create(createAccountQRDTO: RequestAccountQRDTO) {
    const accountQR = await this
      .db
      .insert(schema.accountQRs)
      .values(createAccountQRDTO)
      .returning();

    this.logger.info({ msg: 'Creating QR Code for Account ID: ' + accountQR[0].account_id, accountQR });
  }

  async deleteByAccountId(accountId: string) {
    return this.db
      .delete(schema.accountQRs)
      .where(eq(schema.accountQRs.account_id, accountId))
      .returning();
  }
}