import { Inject, Injectable } from "@nestjs/common";
import { MinioService } from "src/minio-s3/minio.service";
import { PG_CONNECTION } from "src/constants";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { schema } from "src/drizzle/schema";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { eq } from "drizzle-orm";
import { RequestAccountQRDTO } from "src/drizzle/schema/account-qr";
import { QRCodeCanvas } from '@loskir/styled-qr-code-node';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class QRCodeService {
  private readonly logoPath = path.join(__dirname, '..', '..', 'public', 'logo.png');

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
    // Step 2: Read the logo file
    const logo = fs.readFileSync(this.logoPath);

    const qrCode: QRCodeCanvas = new QRCodeCanvas({
      data: userId,
      image: logo,
      dotsOptions: {
        type: 'rounded',
        gradient: {
          type: "linear",
          rotation: 1.5707963267948966,
          colorStops: [
            {
              color: '#4C27A0',
              offset: 0
            },
            {
              color: '#A649E2',
              offset: 1
            }
          ]
        }
      },
      cornersSquareOptions: {
        type: 'square',
        color: '#4C27A0',
      },
      cornersDotOptions: {
        type: 'square',
        color: '#4C27A0',
      },
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: 0.4,
        margin: 2
      },
      qrOptions: {
        typeNumber: 4,
        mode: 'Byte',
        errorCorrectionLevel: 'Q'
      }
    })

    const qrCodeBuffer = await qrCode.toBuffer('png');

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