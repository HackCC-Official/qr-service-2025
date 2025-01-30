import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true
  });

  app.setGlobalPrefix(process.env.NODE_ENV === 'production' ? 'qr-service' : '')

  const config = new DocumentBuilder()
    .setTitle('QR Service')
    .setDescription('QR Service API Documentation')
    .setVersion('0.1')
    .build()

  const documentFactory = () => SwaggerModule.createDocument(app, config, { ignoreGlobalPrefix: false });

  console.log(process.env.NODE_ENV)

  SwaggerModule.setup('qr-service/docs', app, documentFactory);

  await app.listen(3000);
}
bootstrap();
