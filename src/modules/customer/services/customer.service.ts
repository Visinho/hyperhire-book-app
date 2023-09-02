import { Injectable, Logger } from '@nestjs/common';
import { CustomerRepository } from '../repository/customer.repository';
import { SignUpInput } from '../../auth/dto/signup.input';

@Injectable()
export class CustomerService {
  private readonly logger = new Logger(CustomerService.name);
  constructor(private repository: CustomerRepository) {}

  async getCustomerByEmail(email: string) {
    try {
      const customer = await this.repository.findCustomerByEmail(email);

      return customer;
    } catch (error) {
      this.logger.error({ stack: error?.stack, message: error?.message });
      return error;
    }
  }
  async checkDuplicateEmail(email: string) {
    try {
      await this.repository.checkDuplicateEmail(email);
    } catch (error) {
      this.logger.error({ stack: error?.stack, message: error?.message });
      return error;
    }
  }
  async createCustomer(signUpInput: SignUpInput) {
    try {
      const customer = await this.repository.createCustomer(signUpInput);

      return customer;
    } catch (error) {
      this.logger.error({ stack: error?.stack, message: error?.message });
      return error;
    }
  }
}
