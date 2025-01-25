import { Controller, Get, Param, Post } from "@nestjs/common";
import { QRService } from "./qr.service";

@Controller('qr-code')
export class QrController {
  constructor(
    private qrService: QRService
  ) {}

  // @Post(':id')
  // async createQrCode(
  //   @Param('id') userId: string
  // ) {
  //   return this.qrService.generateQRCode(userId);
  // }
}
