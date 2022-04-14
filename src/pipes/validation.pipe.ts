import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { ValidationException } from '../exceptions/validation.exception';
import { Transaction } from 'sequelize';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    if (value instanceof Transaction) {
      return undefined;
    }

    const obj = plainToClass(metadata.metatype, value);
    const errors = await validate(obj);

    if (errors.length) {
      const messages = errors.map(
        (err) =>
          `${err.property} - ${
            err.constraints[Object.keys(err.constraints)[0]]
          }`,
      );
      throw new ValidationException(messages);
    }

    return obj;
  }
}
