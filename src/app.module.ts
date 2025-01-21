import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DrizzleModule } from './drizzle/drizzle.module';
import { EventModule } from './event/event.module';

@Module({
  imports: [DrizzleModule, EventModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
