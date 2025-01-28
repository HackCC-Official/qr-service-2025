import { HttpException, HttpStatus, Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import amqp, { ChannelWrapper, Channel } from 'amqp-connection-manager';
import { ConfirmChannel } from "amqplib";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { QRService } from "src/qr-code/qr-code.service";
import { Account } from "./account";

@Injectable()
export class AccountConsumerService implements OnModuleInit {
  private channelWrapper: ChannelWrapper;
  
  @InjectPinoLogger(AccountConsumerService.name)
  private readonly logger: PinoLogger;

  constructor(
    private configService: ConfigService,
    private qrService: QRService,
  ) {
    const connection = amqp.connect('amqp://hackcc:2025@rabbitmq:5672');
    this.channelWrapper = connection.createChannel({
      setup: (channel: Channel) => {
        return channel.assertExchange(
          configService.get<string>('ACCOUNT_EXCHANGE'),
          'topic', 
          {
            durable: true 
          }
        )
      }
    });
  }

  async onModuleInit() {
    try {
      await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
        const assertQueue = await channel.assertQueue('attendance-account-queue', { durable: true, deadLetterExchange: 'dead-letter-exchange' })

        await channel.bindQueue(
          assertQueue.queue,
          this.configService.get<string>('ACCOUNT_EXCHANGE'),
          'account.*'
        );

        await channel.consume(
          assertQueue.queue,
          async (message) => {
            if (message) {
              try {
                const content: Account = JSON.parse(message.content.toString());
        
                // Example processing logic that might fail
                const qrCodeURL = await this.qrService.generateQRCode(content.id);
                await this.qrService.create({
                  account_id: content.id,
                  url: qrCodeURL,
                });
        
                // Acknowledge the message after successful processing
                channel.ack(message);
              } catch (error) {
                // Log the error for debugging
                this.logger.error('Failed to process message', error);
        
                // Nack the message to indicate failure
                // true -> requeue the message, false -> dead-letter the message (if configured)
                channel.nack(message, false, false); // (message, all = false, requeue = true)
              }
            }
          }
        )
      })
    } catch (error) {
      this.logger.info("Account consumer error", error);
      throw new HttpException(
        'Error starting account consumer',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}