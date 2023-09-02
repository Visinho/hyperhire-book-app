import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { CustomerService } from '../../customer/services/customer.service';
import { SignUpInput } from '../dto/signup.input';
import { loginDto } from '../types';
import RabbitMQProvider from '../../../providers/broker/rabbitmq.provider';
import { QUEUE_EVENT } from '../../../enums/queue_event.enum';
import { RoutingKeys } from '../../../enums/routingkeys.enum';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private customerService: CustomerService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly messageBroker: RabbitMQProvider,
  ) {}

  async signUp(signUpInput: SignUpInput) {
    try {
      const { userName, fullName, email, password } = signUpInput;

      await this.customerService.checkDuplicateEmail(email);

      const hashedPassword = await this.hashPassword(password);

      const customer = await this.customerService.createCustomer({
        userName,
        fullName,
        email,
        password: hashedPassword,
        point: 100,
      });

      const accessToken = await this.generateJwt(customer?.id, customer?.email);

      const response = { accessToken, customer };

      if (response) {
        const payloads = {
          event: QUEUE_EVENT.CUSTOMER_CREATED,
          customerPayload: response,
        };
        this.messageBroker.produce(payloads, RoutingKeys.ORDER_SERVICE);
      }

      return response;
    } catch (error) {
      this.logger.error({ stack: error?.stack, message: error?.message });
      return error;
    }
  }

  async loginCustomer(data: loginDto) {
    try {
      const result = await this.login(data);
      return result;
    } catch (error) {
      this.logger.error({ stack: error?.stack, message: error?.message });
      return error;
    }
  }

  async validateUser(email: string, pass: string) {
    try {
      const customer = await this.customerService.getCustomerByEmail(email);

      if (!customer) {
        throw new UnauthorizedException('Invalid credentials provided');
      }

      const password = await this.comparePassword(pass, customer?.password);

      if (!password) {
        throw new UnauthorizedException('Invalid credentials provided');
      }

      if (customer && password) {
        const { ...rest } = customer;

        return rest;
      } else {
        return null;
      }
    } catch (error) {
      this.logger.error({ stack: error?.stack, message: error?.message });
      return error;
    }
  }

  async login(user: any) {
    try {
      const payload = { email: user.email };
      return {
        accessToken: this.jwtService.sign(payload),
      };
    } catch (error) {
      this.logger.error({ stack: error?.stack, message: error?.message });
      return error;
    }
  }

  async generateJwt(id: string, email: string) {
    const accessToken = this.jwtService.sign(
      { id, email },
      {
        secret: this.configService.get('JWT_SECRET_KEY'),
        expiresIn: this.configService.get('JWT_EXPIRES'),
      },
    );
    return accessToken;
  }

  async hashPassword(password: string) {
    return await bcrypt.hash(password, bcrypt.genSaltSync(10));
  }

  async comparePassword(password: string, hashPassword: string) {
    const compareHash = await bcrypt.compare(password, hashPassword);
    return compareHash;
  }
}
