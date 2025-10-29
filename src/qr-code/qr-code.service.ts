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
import { AccountService } from "src/account/account.service";

@Injectable()
export class QRCodeService {
  private readonly logoPath = path.join(__dirname, '..', '..', 'public', 'logo.png');

  constructor(
    @Inject(PG_CONNECTION)
    private db: NodePgDatabase<typeof schema>,
    @InjectPinoLogger(QRCodeService.name)
    private readonly logger: PinoLogger,
    private minioService: MinioService,
    private accountService: AccountService
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

    const qrCodeFilename = 'qr-codes/' + this.generateFilename(userId);

    await this.minioService.uploadImg(qrCodeFilename, qrCodeBuffer);
    console.log(qrCodeFilename)
    return qrCodeFilename;
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

  async regenerateQr() {
    await this.db.transaction(async tx => {
      // Get all accounts
      const accounts = await this.accountService.findAll();
      
      // Get existing QR records
      const existingQRs = await tx.query.accountQRs.findMany();
      
      // Create a map of existing QRs by account_id for quick lookup
      const existingQRMap = new Map(
        existingQRs.map(qr => [qr.account_id, qr])
      );
      
      // Process each account
      await Promise.all(
        accounts.map(async account => {
          // Generate QR code for this account
          const qrCodeURL = await this.generateQRCode(String(account.id));
          
          const existingQR = existingQRMap.get(String(account.id));
          
          if (existingQR) {
            // Update existing QR record
            await tx
              .update(schema.accountQRs)
              .set({ url: qrCodeURL })
              .where(eq(schema.accountQRs.id, String(existingQR.id)));
          } else {
            // Insert new QR record
            await tx
              .insert(schema.accountQRs)
              .values({
                url: qrCodeURL,
                account_id: String(account.id)
              });
          }
        })
      );
    });
  }

  async deleteByAccountId(accountId: string) {
    return this.db
      .delete(schema.accountQRs)
      .where(eq(schema.accountQRs.account_id, accountId))
      .returning();
  }
}