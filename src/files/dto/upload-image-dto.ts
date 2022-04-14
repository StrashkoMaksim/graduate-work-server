import { Validate } from 'class-validator';
import { FileSystemStoredFile, HasMimeType, IsFile } from 'nestjs-form-data';
import { IsImage } from '../../validation/is-image';

export class UploadImageDto {
  @IsFile({ message: 'Поле должно быть файлом' })
  @Validate(IsImage)
  file: FileSystemStoredFile;
}
