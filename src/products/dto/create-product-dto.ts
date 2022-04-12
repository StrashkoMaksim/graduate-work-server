import {
  IsDefined,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsString,
  Validate,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { toFilesArray } from '../../validation/to-files-array';
import { IsImagesArray } from '../../validation/is-images-array';
import { FileSystemStoredFile } from 'nestjs-form-data';

export class CreateProductDto {
  @IsString({ message: 'Название должно быть строкой' })
  @IsNotEmpty({ message: 'Название не должно быть пустым' })
  readonly name: string;

  @Type(() => Number)
  @IsNumber({}, { message: 'Цена должна быть числом' })
  @IsNotEmpty({ message: 'Цена не должна быть пустой' })
  readonly price: number;

  @Type(() => Number)
  @IsNumber({}, { message: 'Номер категории должен быть числом' })
  @IsNotEmpty({ message: 'Номер категории не должен быть пустым' })
  readonly categoryId: number;

  @IsDefined({ message: 'Характеристики не должны быть пустыми' })
  @Transform((val) => JSON.parse(val.value))
  @IsNotEmptyObject({}, { message: 'Характеристики не должны быть пустыми' })
  readonly characteristics: {
    [key: string]: string | number | boolean;
  };

  @IsDefined({ message: 'Отсутствуют изображения' })
  @Transform(toFilesArray)
  @Validate(IsImagesArray)
  images: FileSystemStoredFile[];
}
