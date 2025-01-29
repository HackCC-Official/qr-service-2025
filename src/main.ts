import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true
  });

  if (process.env.NODE_ENV === 'production') {
    app.setGlobalPrefix('qr-service');
  }

  const config = new DocumentBuilder()
    .setTitle('QR Service')
    .setDescription('QR Service API Documentation')
    .setVersion('0.1')
    .build()

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  console.log(process.env.NODE_ENV)

  SwaggerModule.setup('docs', app, documentFactory);

  await app.listen(3000);
}
bootstrap();
