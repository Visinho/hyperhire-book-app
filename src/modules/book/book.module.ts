import { Module } from '@nestjs/common';
import { BookRepository } from './repository/book.repository';
import { PrismaModule } from '../../database/prisma.module';
import { BookController } from './controller/book.contoller';
import { BookService } from './services/book.service';
import { ProcessQueueService } from '../../providers/broker/processqueue.service';
import RabbitMQProvider from '../../providers/broker/rabbitmq.provider';

@Module({
  imports: [PrismaModule],
  providers: [
    BookRepository,
    BookService,
    RabbitMQProvider,
    ProcessQueueService,
  ],
  controllers: [BookController],
  exports: [BookService],
})
export class BookModule {}
