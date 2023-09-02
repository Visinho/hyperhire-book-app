import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { CreateBook } from '../dto/createbook.input';

@Injectable()
export class BookRepository {
  private readonly logger = new Logger(BookRepository.name);
  constructor(private prisma: PrismaService) {}

  async createBook(userId: string, createBook: CreateBook) {
    const { title, writer, coverImage, price, tag } = createBook;

    try {
      const book = await this.prisma.book.create({
        data: {
          title,
          writer,
          coverImage,
          price,
          tag,
          customer: { connect: { id: userId } },
        },
      });

      return book;
    } catch (error) {
      this.logger.error({ stack: error?.stack, message: error?.message });
      return error;
    }
  }

  async bookById(bookId: string) {
    try {
      const book = await this.prisma.book.findUnique({
        where: {
          id: bookId,
        },
        include: { customer: true },
      });

      if (!book) {
        throw new NotFoundException('Book not found');
      }

      return book;
    } catch (error) {
      this.logger.error({ stack: error?.stack, message: error?.message });
      return error;
    }
  }

  async updateBook(bookId: string, updateBookInput: CreateBook) {
    try {
      const { title, writer, coverImage, price, tag } = updateBookInput;

      await this.prisma.book.update({
        where: {
          id: bookId,
        },
        data: {
          title,
          writer,
          coverImage,
          price,
          tag,
        },
        include: { customer: true },
      });

      const response = await this.bookById(bookId);

      return response;
    } catch (error) {
      this.logger.error({ stack: error?.stack, message: error?.message });
      return error;
    }
  }
}
