import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';
import { CategoryCharacteristicsType } from './category-characteristics.interface';

export function ValidateCategoryCharacteristics(
  validationOptions?: ValidationOptions,
) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'ValidateCategoryCharacteristics',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(object: any, args: ValidationArguments) {
          args.value;

          if (object === undefined) {
            return false;
          }

          for (const field of Object.entries(object)) {
            const isGoodValue =
              field[1] === CategoryCharacteristicsType.String ||
              field[1] === CategoryCharacteristicsType.Integer ||
              field[1] === CategoryCharacteristicsType.Double ||
              field[1] === CategoryCharacteristicsType.Boolean;

            if (typeof field[0] !== 'string' || !isGoodValue) {
              return false;
            }
          }
          return true;
        },
        defaultMessage(args) {
          return 'Некорректный объект с характеристиками';
        },
      },
    });
  };
}
