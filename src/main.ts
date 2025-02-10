import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true
  });

  app.enableCors();
  app.setGlobalPrefix(process.env.NODE_ENV === 'production' ? 'qr-service' : '')

  const config = new DocumentBuilder()
    .setTitle('QR Service')
    .setDescription('QR Service API Documentation')
    .setVersion('0.1')
    .build()

  const documentFactory = () => SwaggerModule.createDocument(app, config, { ignoreGlobalPrefix: false });
  
  SwaggerModule.setup(
    process.env.NODE_ENV === 'production' ? 'qr-service/docs' : 'docs', 
    app, 
    documentFactory
  );

  await app.listen(3000);
}
bootstrap();
