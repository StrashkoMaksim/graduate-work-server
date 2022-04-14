import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'customText', async: false })
export class IsIntNumbers implements ValidatorConstraintInterface {
  validate(array: [any], args: ValidationArguments) {
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
