import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ObjectSchema } from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  async transform(data: any): Promise<void> {
    try {
      const value = await this.schema.validateAsync(data);
      return value;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
