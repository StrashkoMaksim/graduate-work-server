import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'isIntNumbers', async: false })
export class IsIntNumbers implements ValidatorConstraintInterface {
  validate(array: [any], args: ValidationArguments) {
    if (!(array instanceof Array)) {
      return false;
    }

    for (const el of array) {
      if (typeof el !== 'number' || !Number.isInteger(el)) {
        return false;
      }
    }
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Массив должен содержать целые числа';
  }
}
