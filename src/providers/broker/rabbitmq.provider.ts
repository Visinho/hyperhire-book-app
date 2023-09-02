import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import amqp from 'amqplib';

import { winstonLogger } from '../../helper/winston';

import { IMessageBroker } from '../../interfaces/IMessageBroker';
import { RoutingKeys } from 'src/enums/routingkeys.enum';
import { ProcessQueueService } from './processqueue.service';

import { EXCHANGE_NAME, EXCHANGE_TYPE, QUEUE_NAME } from './constants';

@Injectable()
export default class RabbitMQProvider implements IMessageBroker {
  private readonly logger = new Logger(RabbitMQProvider.name);
  private rabbitMqUrl: string;

  constructor(
    private configService: ConfigService,
    private readonly processQueueService: ProcessQueueService,
  ) {
    this.rabbitMqUrl = this.configService.get<string>('RABBITMQ_URL', {
      infer: true,
    });
  }

  async produce(payload: any, routeTo: RoutingKeys): Promise<boolean> {
    try {
      const connection = await amqp.connect(this.rabbitMqUrl);
      const channel = await connection.createChannel();

      const isPublished = await channel.assertExchange(
        EXCHANGE_NAME,
        EXCHANGE_TYPE,
        {
          durable: true,
        },
      );

      if (isPublished) {
        channel.publish(
          EXCHANGE_NAME,
          routeTo,
          Buffer.from(JSON.stringify(payload)),
        );
        winstonLogger.info('message published');
        channel.close();
      }
    } catch (error) {
      winstonLogger.error('produce', error.message);
      return false;
    }
  }

  async consume(): Promise<void> {
    try {
      const connection = await amqp.connect(this.rabbitMqUrl);
      const channel = await connection.createChannel();

      await Promise.all([
        channel.assertQueue(QUEUE_NAME),
        channel.assertExchange(EXCHANGE_NAME, EXCHANGE_TYPE, {
          durable: true,
        }),
        channel.prefetch(1),
        channel.bindQueue(QUEUE_NAME, EXCHANGE_NAME, QUEUE_NAME),
      ]);

      await channel.consume(QUEUE_NAME, async (msg) => {
        const message = JSON.parse(msg?.content?.toString());

        const isAcknowledged = await this.processQueueService.processQueue(
          message,
        );

        if (isAcknowledged) {
          channel.ack(msg);
        }
        winstonLogger.info('Message isAcknowledged: \n %s', isAcknowledged);
      });
    } catch (error) {
      winstonLogger.error('consume', error.massage);
      this.logger.error({ stack: error?.stack, message: error?.message });
    }
  }
}
