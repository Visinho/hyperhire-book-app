import { Controller, forwardRef, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import RabbitMQProvider from './providers/broker/rabbitmq.provider';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(forwardRef(() => RabbitMQProvider))
    private readonly messageBroker: RabbitMQProvider,
  ) {
    this.dequeue();
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  async dequeue() {
    this.messageBroker.consume();
  }
}
