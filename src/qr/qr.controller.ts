import { Controller, Get, Param, Post } from "@nestjs/common";
import { QRService } from "./qr.service";

@Controller('qr-code')
export class QrController {
  constructor(
    private qrService: QRService
  ) {}

  @Get(':id')
  findById(
    @Param('id') id: string
  ) {
    return this.qrService.findById(id);
  }

  // @Post(':id')
  // async createQrCode(
  //   @Param('id') userId: string
  // ) {
  //   return this.qrService.generateQRCode(userId);
  // }
}
