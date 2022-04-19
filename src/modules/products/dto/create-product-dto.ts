import {
  IsDefined,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber, IsOptional,
  IsString,
  Validate,
} from 'class-validator';
import { IsIntNumbers } from '../../../validation/is-int-numbers';
import { IsStrings } from '../../../validation/is-strings';

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

  @Validate(IsIntNumbers)
  images: number[];

  @Validate(IsIntNumbers)
  examples: number[];

  @IsOptional()
  @Validate(IsStrings)
  videos: string[];
}
