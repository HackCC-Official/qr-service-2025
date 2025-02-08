import { HttpException, HttpStatus, Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import amqp, { ChannelWrapper, Channel } from 'amqp-connection-manager';
import { ConfirmChannel } from "amqplib";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { QRCodeService } from "src/qr-code/qr-code.service";
import { Account } from "./account";

@Injectable()
export class AccountConsumerService implements OnModuleInit {
  private channelWrapper: ChannelWrapper;
  
  @InjectPinoLogger(AccountConsumerService.name)
  private readonly logger: PinoLogger;

  constructor(
    private configService: ConfigService,
    private qrService: QRCodeService,
  ) {
    const connection = amqp.connect(this.configService.get<string>('RABBITMQ_URL'));
    console.log(this.configService.get<string>('RABBITMQ_URL'))
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
      // CREATED

      
      await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
        const createAccountQueue = await channel.assertQueue('create-account-queue', { durable: true, deadLetterExchange: 'dead-letter-exchange' })

        await channel.bindQueue(
          createAccountQueue.queue,
          this.configService.get<string>('ACCOUNT_EXCHANGE'),
          'account.create'
        );

        await channel.consume(
          createAccountQueue.queue,
          async (message) => {
            if (message) {
              try {
                const content: Account = JSON.parse(message.content.toString());
        
                // Example processing logic that might fail
                const qrCodeURL = await this.qrService.generateQRCode(content.id);
                const qrCodeObj = await this.qrService.create({
                  account_id: content.id,
                  url: qrCodeURL,
                });
        
                // Acknowledge the message after successful processing
                channel.ack(message);
                
                this.logger.info('account id: ' + content.id);
                this.logger.info('processed created qr-code object', qrCodeObj);
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

        // DELETE

        const deleteAccountQueue = await channel.assertQueue('delete-account-queue', { durable: true, deadLetterExchange: 'dead-letter-exchange' })

        await channel.bindQueue(
          deleteAccountQueue.queue,
          this.configService.get<string>('ACCOUNT_EXCHANGE'),
          'account.delete'
        );

        await channel.consume(
          deleteAccountQueue.queue,
          async (message) => {
            if (message) {
              try {
                const content: Account = JSON.parse(message.content.toString());

                const qrCodeObj = await this.qrService.deleteByAccountId(content.id);

                // Acknowledge the message after successful processing
                channel.ack(message);

                this.logger.info('account id: ' + content.id);
                this.logger.info('processed delete qr-code object', qrCodeObj);
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