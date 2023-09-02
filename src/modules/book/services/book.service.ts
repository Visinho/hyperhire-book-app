import { Injectable, Logger } from '@nestjs/common';
import { BookRepository } from '../repository/book.repository';
import { CreateBook } from '../dto/createbook.input';
import RabbitMQProvider from '../../../providers/broker/rabbitmq.provider';
import { QUEUE_EVENT } from '../../../enums/queue_event.enum';
import { RoutingKeys } from '../../../enums/routingkeys.enum';

@Injectable()
export class BookService {
  private readonly logger = new Logger(BookService.name);
  constructor(
    private repository: BookRepository,
    private readonly messageBroker: RabbitMQProvider,
  ) {}

  async createBook(userId: string, createBook: CreateBook) {
    try {
      const book = await this.repository.createBook(userId, createBook);
      if (book) {
        const payloads = {
          event: QUEUE_EVENT.BOOK_CREATED,
          bookPayload: book,
        };
        this.messageBroker.produce(payloads, RoutingKeys.ORDER_SERVICE);
      }

      return book;
    } catch (error) {
      this.logger.error({ stack: error?.stack, message: error?.message });
      return error;
    }
  }

  async bookById(bookId: string) {
    try {
      const book = await this.repository.bookById(bookId);

      return book;
    } catch (error) {
      this.logger.error({ stack: error?.stack, message: error?.message });
      return error;
    }
  }

  async updateBook(bookId: string, updateBook: CreateBook) {
    try {
      const book = await this.repository.updateBook(bookId, updateBook);

      return book;
    } catch (error) {
      this.logger.error({ stack: error?.stack, message: error?.message });
      return error;
    }
  }
}
