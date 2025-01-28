import { Module } from '@nestjs/common';
import { DrizzleModule } from './drizzle/drizzle.module';
import { EventModule } from './event/event.module';
import { LoggerModule } from 'nestjs-pino';
import { MinioModule } from './minio-s3/minio.module';
import { QRModule } from './qr/qr.module';
import { AccountConsumerModule } from './account-consumer/account-consumer.module';
import { ConfigModule } from '@nestjs/config';

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
    QRModule,
    AccountConsumerModule
  ],
})
export class AppModule {}
