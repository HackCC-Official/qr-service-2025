import { Module } from '@nestjs/common';
import { DrizzleModule } from './drizzle/drizzle.module';
import { EventModule } from './event/event.module';
import { LoggerModule } from 'nestjs-pino';
import { MinioModule } from './minio-s3/minio.module';
import { QRCodeModule } from './qr-code/qr-code.module';
import { AccountConsumerModule } from './account-consumer/account-consumer.module';
import { ConfigModule } from '@nestjs/config';
import { AttendanceModule } from './attendance/attendance.module';
import { AccountService } from './account/account.service';
import { AccountModule } from './account/account.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        autoLogging: false,
        quietReqLogger: true,
        transport: {
          target: 'pino-pretty',
        },
      },
    }), 
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local']
    }),
    DrizzleModule, 
    EventModule,
    MinioModule,
    QRCodeModule,
    AccountConsumerModule,
    AttendanceModule,
    AccountModule,
  ],
})
export class AppModule {}
