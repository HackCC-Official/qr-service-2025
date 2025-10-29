import { HttpException, HttpStatus, Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import amqp, { ChannelWrapper, Channel } from 'amqp-connection-manager';
import { ConfirmChannel } from "amqplib";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { QRCodeService } from "src/qr-code/qr-code.service";
import { Account } from "./account";
import { ApplicationDTO } from "src/application-consumer/application";
import { AccountDTO } from "src/account/account.dto";

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
      await this.channelWrapper.addSetup(async (channel: ConfirmChannel) => {
        // DELETE
        const accountExchange = this.configService.get<string>('ACCOUNT_EXCHANGE');
        const accountQueue = this.configService.get<string>('ACCOUNT_QUEUE');

        const accountQueueInstance = await channel.assertQueue('account_queue', { durable: true, deadLetterExchange: 'dead-letter-exchange' })
        await channel.bindQueue(
          accountQueueInstance.queue,
          accountExchange,
          'account.created'
        );

        await channel.consume(
          accountQueueInstance.queue,
          // HANDLER FOR RECEIVING MESSAGE, ADD CODE HERE!!
          async (message) => {
            if (message) {
              try {
                const content: ApplicationDTO = JSON.parse(message.content.toString());
                const account: AccountDTO = content.user;
                // Example processing logic that might fail
                const qrCodeURL = await this.qrService.generateQRCode(account.id);
                console.log(account, {
                  account_id: account.id,
                  url: qrCodeURL,
                })
                const qrCodeObj = await this.qrService.create({
                  account_id: account.id,
                  url: qrCodeURL,
                });
        
                // Acknowledge the message after successful processing
                channel.ack(message);
                
                this.logger.info('account id: ' + account.id);
                this.logger.info('processed created qr-code object', qrCodeObj);
              } catch (error) {
                // Log the error for debugging
                this.logger.error('Failed to process message', error);
                console.log("ERROR", error)
        
                // Nack the message to indicate failure
                // true -> requeue the message, false -> dead-letter the message (if configured)
                channel.nack(message, false, false); // (message, all = false, requeue = true)
              }
            }
          }
        )

        await channel.bindQueue(
          accountQueueInstance.queue,
          this.configService.get<string>('ACCOUNT_EXCHANGE'),
          'account.delete'
        );

        await channel.consume(
          accountQueueInstance.queue,
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