import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BookService } from '../services/book.service';
import {
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { winstonLogger } from '../../../helper/winston';
import { CreateBook } from '../dto/createbook.input';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}
  @UseGuards(JwtAuthGuard)
  @Post('create')
  @ApiCreatedResponse({ type: CreateBook })
  @ApiBadRequestResponse()
  @ApiConflictResponse()
  async create(
    @Body()
    createBook: CreateBook,
    @Request() req,
  ) {
    try {
      const user = req.user;
      const book = await this.bookService.createBook(user.id, createBook);

      return book;
    } catch (error) {
      winstonLogger.error('create: \n %s', error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOkResponse({
    type: CreateBook,
    description: 'Book detail fetched successfully!',
  })
  @ApiNotFoundResponse()
  @Get(':bookId')
  async findBookById(@Param('bookId') bookId: string) {
    return this.bookService.bookById(bookId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('defaultBearerAuth')
  @ApiOkResponse({
    type: CreateBook,
    description: 'Book detail updated successfully!',
  })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @Patch(':bookId')
  async update(
    @Param('bookId') bookId: string,
    @Body() updateBook: CreateBook,
  ) {
    return this.bookService.updateBook(bookId, updateBook);
  }
}
