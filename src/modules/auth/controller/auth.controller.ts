import { Controller, Body, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import {
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { winstonLogger } from '../../../helper/winston';
import { SignUpInput } from '../dto/signup.input';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { LoginDto } from '../dto/login.input';

@Controller('customer')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiCreatedResponse({ type: SignUpInput })
  @ApiBadRequestResponse()
  @ApiConflictResponse()
  async create(
    @Body()
    signUpInput: SignUpInput,
  ) {
    try {
      const customer = await this.authService.signUp(signUpInput);

      return customer;
    } catch (error) {
      winstonLogger.error('create: \n %s', error);
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiCreatedResponse({ type: LoginDto })
  @ApiBadRequestResponse()
  async login(@Body() loginDto: LoginDto, @Request() req) {
    try {
      const data = await this.authService.login(loginDto);
      const user = req.user;

      return {
        ...data,
        ...user,
      };
    } catch (error) {
      winstonLogger.error('create: \n %s', error);
    }
  }
}
