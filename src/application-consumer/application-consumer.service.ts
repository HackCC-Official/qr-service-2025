import { HttpException, HttpStatus, Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import amqp, { ChannelWrapper, Channel } from 'amqp-connection-manager';
import { ConfirmChannel } from "amqplib";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { QRCodeService } from "src/qr-code/qr-code.service";
import { Account } from "./account";
import { application, Application } from "express";
import { ApplicationDTO } from "./application";
import { AccountDTO } from "src/account/account.dto";

@Injectable()
export class ApplicationConsumerService implements OnModuleInit {
  private channelWrapper: ChannelWrapper;
  
  @InjectPinoLogger(ApplicationConsumerService.name)
  private readonly logger: PinoLogger;

  constructor(
    private configService: ConfigService,
    private qrService: QRCodeService,
  ) {
    const connection = amqp.connect(this.configService.get<string>('RABBITMQ_URL'));
    const exchange = configService.get<string>('APPLICATION_EXCHANGE');
    this.channelWrapper = connection.createChannel({
      setup: (channel: Channel) => {
        return channel.assertExchange(
          exchange,
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
      const exchange = this.configService.get<string>('APPLICATION_EXCHANGE');
      const queue = this.configService.get<string>('APPLICATION_QUEUE');
      await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
        const createApplicationQueue = await channel.assertQueue(queue, { durable: true, deadLetterExchange: 'dead-letter-exchange' })

        await channel.bindQueue(
          createApplicationQueue.queue,
          exchange,
          'application.accept'
        );

        await channel.consume(
          createApplicationQueue.queue,
          // HANDLER FOR RECEIVING MESSAGE, ADD CODE HERE!!
          async (message) => {
            if (message) {
              // try {
              //   const content: ApplicationDTO = JSON.parse(message.content.toString());
              //   const account: AccountDTO = content.user;
              //   // Example processing logic that might fail
              //   const qrCodeURL = await this.qrService.generateQRCode(account.id);
              //   console.log(account, {
              //     account_id: account.id,
              //     url: qrCodeURL,
              //   })
              //   const qrCodeObj = await this.qrService.create({
              //     account_id: account.id,
              //     url: qrCodeURL,
              //   });
        
              //   // Acknowledge the message after successful processing
              //   channel.ack(message);
                
              //   this.logger.info('account id: ' + account.id);
              //   this.logger.info('processed created qr-code object', qrCodeObj);
              // } catch (error) {
              //   // Log the error for debugging
              //   this.logger.error('Failed to process message', error);
              //   console.log("ERROR", error)
        
              //   // Nack the message to indicate failure
              //   // true -> requeue the message, false -> dead-letter the message (if configured)
              //   channel.nack(message, false, false); // (message, all = false, requeue = true)
              // }
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