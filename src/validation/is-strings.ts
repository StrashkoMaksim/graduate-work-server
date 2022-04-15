import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsStrings', async: false })
export class IsStrings implements ValidatorConstraintInterface {
  validate(array: [any], args: ValidationArguments) {
    if (!(array instanceof Array)) {
      return false;
    }

    for (const el of array) {
      if (typeof el !== 'string') {
        return false;
      }
    }
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Массив должен содержать строки';
  }
}
