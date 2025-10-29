import { Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { QRCodeService } from "./qr-code.service";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/jwt.auth.guard";
import { AccountRoles } from "src/auth/role.enum";
import { Roles } from "src/auth/roles.decorator";
import { RolesGuard } from "src/auth/roles.guard";
import { MinioService } from "src/minio-s3/minio.service";

@ApiTags('QR Codes')
@Controller('qr-codes')
export class QrCodeController {
  constructor(
    private qrCodeService: QRCodeService,
    private minioService: MinioService
  ) {}

  @ApiOperation({
    summary: 'Finds a QR Code associated with the account_id'
  })
  @ApiParam({
    description: 'ID of account',
    name: 'account_id'
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([AccountRoles.USER, AccountRoles.JUDGE, AccountRoles.ADMIN, AccountRoles.ORGANIZER])
  @Get(':account_id')
  async findByAccountId(
    @Param('account_id') id: string
  ) {
    const qrCode = await this.qrCodeService.findByAccountId(id);
    qrCode.url = await this.minioService.presignedUrl(qrCode.url);
    return qrCode;
  }

  @ApiOperation({
    summary: 'Regenerate a QR COde for everyone else'
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([AccountRoles.ADMIN])
  @Post('regen')
  async regenAllQRCodes() {
    return this.qrCodeService.regenerateQr();
  }

  // @Post(':id')
  // async createQrCode(
  //   @Param('id') userId: string
  // ) {
  //   return this.qrCodeService.generateQRCode(userId);
  // }
}
