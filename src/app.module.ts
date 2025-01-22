import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DrizzleModule } from './drizzle/drizzle.module';
import { EventModule } from './event/event.module';
import { LoggerModule } from 'nestjs-pino';
import { MinioModule } from './minio/minio.module';

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
    DrizzleModule, 
    EventModule,
    MinioModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
