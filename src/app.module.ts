import { Module } from '@nestjs/common';
import { DrizzleModule } from './drizzle/drizzle.module';
import { EventModule } from './event/event.module';
import { LoggerModule } from 'nestjs-pino';
import { MinioModule } from './minio-s3/minio.module';
import { QRCodeModule } from './qr-code/qr-code.module';
import { ApplicationConsumerModule } from './application-consumer/application-consumer.module';
import { ConfigModule } from '@nestjs/config';
import { AttendanceModule } from './attendance/attendance.module';
import { AccountModule } from './account/account.module';
import { MealModule } from './meal/meal.module';
import { WorkshopOrganizerModule } from './workshop-organizer/workshop-organizer.module';
import { WorkshopModule } from './workshop/workshop.module';
import { WorkshopAttendanceModule } from './workshop-attendance/workshop-attendance.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { RolesGuard } from './auth/roles.guard';
import { AuthModule } from './auth/auth.module';
import { TokenInterceptor } from './auth/token.interceptor';
import { HttpModule } from '@nestjs/axios';
import { HackPassModule } from './hack-pass/hack-pass.module';
import { AccountConsumerModule } from './account-consumer/account-consumer.module';
import { ApplicationModule } from './application/application.module';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TokenInterceptor,
    },
  ],
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
    ApplicationConsumerModule,
    AccountConsumerModule,
    AttendanceModule,
    MealModule,
    AccountModule,
    WorkshopModule,
    WorkshopOrganizerModule,
    WorkshopAttendanceModule,
    HackPassModule,
    ApplicationModule,
    AuthModule,
    HttpModule
  ],
})
export class AppModule {}
