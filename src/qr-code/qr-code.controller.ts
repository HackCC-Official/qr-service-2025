import { Controller, Get, Param, Post } from "@nestjs/common";
import { QRCodeService } from "./qr-code.service";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('QR Codes')
@Controller('qr-codes')
export class QrCodeController {
  constructor(
    private qrCodeService: QRCodeService
  ) {}

  @Get(':account_id')
  findByAccountId(
    @Param('account_id') id: string
  ) {
    return this.qrCodeService.findByAccountId(id);
  }

  // @Post(':id')
  // async createQrCode(
  //   @Param('id') userId: string
  // ) {
  //   return this.qrService.generateQRCode(userId);
  // }
}
