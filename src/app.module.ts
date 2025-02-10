import { Module } from '@nestjs/common';
import { DrizzleModule } from './drizzle/drizzle.module';
import { EventModule } from './event/event.module';
import { LoggerModule } from 'nestjs-pino';
import { MinioModule } from './minio-s3/minio.module';
import { QRCodeModule } from './qr-code/qr-code.module';
import { AccountConsumerModule } from './account-consumer/account-consumer.module';
import { ConfigModule } from '@nestjs/config';
import { AttendanceModule } from './attendance/attendance.module';
import { AccountModule } from './account/account.module';
import { MealModule } from './meal/meal.module';

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
    MealModule,
    AccountModule,
  ],
})
export class AppModule {}
