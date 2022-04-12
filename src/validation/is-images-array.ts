import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { StoredFile } from 'nestjs-form-data';

@ValidatorConstraint({ name: 'customText', async: false })
export class IsImagesArray implements ValidatorConstraintInterface {
  validate(array: [any], args: ValidationArguments) {
    for (const el of array) {
      const isFileInstance = el instanceof StoredFile;
      const isImageExtension =
        el.mimetype === 'image/jpeg' || el.mimetype === 'image/png';
      if (!isFileInstance || !isImageExtension) {
        return false;
      }
    }
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Массив должен содержать только изображения в форматах ".jpeg" и ".png"';
  }
}
