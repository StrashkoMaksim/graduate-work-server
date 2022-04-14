import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'customText', async: false })
export class IsImage implements ValidatorConstraintInterface {
  validate(file: any, args: ValidationArguments) {
    if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
      return false;
    }
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Изображение должно быть в формате JPEG или PNG';
  }
}
