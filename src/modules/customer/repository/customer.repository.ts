import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { SignUpInput } from '../../auth/dto/signup.input';

@Injectable()
export class CustomerRepository {
  private readonly logger = new Logger(CustomerRepository.name);
  constructor(private prisma: PrismaService) {}

  async findCustomerByEmail(email: string) {
    try {
      const customer = await this.prisma.customer.findUnique({
        where: {
          email,
        },
      });

      if (!customer) {
        throw new NotFoundException('Customer not found');
      }

      return customer;
    } catch (error) {
      this.logger.error({ stack: error?.stack, message: error?.message });
      return error;
    }
  }

  async checkDuplicateEmail(email: string): Promise<void> {
    const existingUser = await this.prisma.customer.findFirst({
      where: {
        email,
      },
    });

    if (existingUser) {
      throw new ConflictException('Email already in use.');
    }
  }

  async createCustomer(signUpInput: SignUpInput) {
    const { userName, fullName, email, password, point } = signUpInput;

    try {
      const customer = await this.prisma.customer.create({
        data: {
          userName,
          fullName,
          email,
          password,
          point,
        },
      });

      return customer;
    } catch (error) {
      this.logger.error({ stack: error?.stack, message: error?.message });
      return error;
    }
  }
}
