import {
  IsArray,
  IsDefined,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsString,
  Validate,
} from 'class-validator';
import { IsIntNumbers } from '../../validation/is-int-numbers';

export class CreateProductDto {
  @IsString({ message: 'Название должно быть строкой' })
  @IsNotEmpty({ message: 'Название не должно быть пустым' })
  readonly name: string;

  @IsNumber({ maxDecimalPlaces: 0 }, { message: 'Цена должна быть числом' })
  @IsNotEmpty({ message: 'Цена не должна быть пустой' })
  readonly price: number;

  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: 'Номер категории должен быть числом' },
  )
  @IsNotEmpty({ message: 'Номер категории не должен быть пустым' })
  readonly categoryId: number;

  @IsDefined({ message: 'Характеристики не должны быть пустыми' })
  @IsNotEmptyObject({}, { message: 'Характеристики не должны быть пустыми' })
  readonly characteristics: {
    [key: string]: string | number | boolean;
  };

  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: 'ID превью должен быть целым числом' },
  )
  @IsNotEmpty({ message: 'Отсутствует ID превью' })
  readonly previewImage: number;

  @IsDefined({ message: 'Отсутствуют ID изображений' })
  @IsArray({ message: 'ID изображений должны быть массивом' })
  @Validate(IsIntNumbers)
  images: number[];
}
