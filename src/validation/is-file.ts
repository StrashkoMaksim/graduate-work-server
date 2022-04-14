import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { StoredFile } from 'nestjs-form-data';

@ValidatorConstraint({ name: 'customText', async: false })
export class IsFile implements ValidatorConstraintInterface {
  validate(file: any, args: ValidationArguments) {
    if (file instanceof StoredFile && !file['']) {
      return true;
    }
    return false;
  }

  defaultMessage(args: ValidationArguments) {
    return 'Поле должно быть файлом';
  }
}
