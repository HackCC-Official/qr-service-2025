import { Controller, Get, Param, Post } from "@nestjs/common";
import { QRService } from "./qr-code.service";

@Controller('qr-codes')
export class QrController {
  constructor(
    private qrService: QRService
  ) {}

  @Get(':account_id')
  findByAccountId(
    @Param('account_id') id: string
  ) {
    return this.qrService.findByAccountId(id);
  }

  // @Post(':id')
  // async createQrCode(
  //   @Param('id') userId: string
  // ) {
  //   return this.qrService.generateQRCode(userId);
  // }
}
