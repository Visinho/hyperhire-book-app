import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CustomerService } from '../../customer/services/customer.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private customerService: CustomerService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET_KEY,
    });
  }

  // what is returned here is available in the req.user
  async validate(payload: any) {
    const user = await this.customerService.getCustomerByEmail(payload.email);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
