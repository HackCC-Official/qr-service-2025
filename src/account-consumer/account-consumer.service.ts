import { HttpException, HttpStatus, Inject, Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import amqp, { ChannelWrapper, Channel } from 'amqp-connection-manager';
import { ConfirmChannel } from "amqplib";
import { InjectPinoLogger, PinoLogger } from "nestjs-pino";
import { QRCodeService } from "src/qr-code/qr-code.service";
import { Account } from "./account";
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
        const accountExchange = this.configService.get<string>('ACCOUNT_EXCHANGE');
        
        // CREATE QUEUE
        const createQueue = await channel.assertQueue('account.create.queue', { 
          durable: true, 
          deadLetterExchange: 'dead-letter-exchange' 
        });
        
        await channel.bindQueue(createQueue.queue, accountExchange, 'account.create');
        
        await channel.consume(createQueue.queue, async (message) => {
          if (message) {
            try {
              const content: AccountDTO = JSON.parse(message.content.toString());
              const qrCodeURL = await this.qrService.generateQRCode(content.id);
              const qrCodeObj = await this.qrService.create({
                account_id: content.id,
                url: qrCodeURL,
              });
              
              channel.ack(message);
              this.logger.info('account id: ' + content.id);
              this.logger.info('processed created qr-code object', qrCodeObj);
            } catch (error) {
              this.logger.error('Failed to process create message', error);
              channel.nack(message, false, false);
            }
          }
        });

        // DELETE QUEUE
        const deleteQueue = await channel.assertQueue('account.delete.queue', { 
          durable: true, 
          deadLetterExchange: 'dead-letter-exchange' 
        });
        
        await channel.bindQueue(deleteQueue.queue, accountExchange, 'account.delete');
        
        await channel.consume(deleteQueue.queue, async (message) => {
          if (message) {
            try {
              const content: Account = JSON.parse(message.content.toString());
              const qrCodeObj = await this.qrService.deleteByAccountId(content.id);
              
              channel.ack(message);
              this.logger.info('account id: ' + content.id);
              this.logger.info('processed delete qr-code object', qrCodeObj);
            } catch (error) {
              this.logger.error('Failed to process delete message', error);
              channel.nack(message, false, false);
            }
          }
        });
      });
    } catch (error) {
      this.logger.info("Account consumer error", error);
      throw new HttpException(
        'Error starting account consumer',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}