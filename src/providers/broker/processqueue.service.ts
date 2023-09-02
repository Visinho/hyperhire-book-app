import { Injectable } from '@nestjs/common';
import { QUEUE_EVENT } from '../../enums/queue_event.enum';
import { winstonLogger } from '../../helper/winston';

@Injectable()
export class ProcessQueueService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {}

  /**
   * This method is responsible for processing consume queues from RabbitMQ
   * @param payload
   * @returns
   */
  async processQueue(payload: any): Promise<any> {
    try {
      const { event } = payload;
      switch (event.toLowerCase()) {
        case QUEUE_EVENT.ORDER_CREATED:
          console.info('Calling customer created........');
          return '';

        default:
          break;
      }
    } catch (error) {
      winstonLogger.error('Error: \n %s', error);
    }
  }
}
