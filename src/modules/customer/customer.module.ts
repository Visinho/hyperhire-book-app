import { Module } from '@nestjs/common';
import { CustomerRepository } from './repository/customer.repository';
import { CustomerService } from './services/customer.service';
import { CustomerController } from './controller/customer.controller';
import { PrismaModule } from '../../database/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [CustomerRepository, CustomerService],
  controllers: [CustomerController],
  exports: [CustomerService],
})
export class CustomerModule {}
