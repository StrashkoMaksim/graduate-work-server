import {
  ArrayMinSize,
  IsArray,
  IsDefined,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber, IsOptional,
  IsString, MinLength,
  Validate,
} from 'class-validator';
import { IsIntNumbers } from '../../../validation/is-int-numbers';
import { IsStrings } from '../../../validation/is-strings';
import { ProductCharacteristic } from '../products.model';

export class CreateProductDto {
  @IsString({ message: 'Название должно быть строкой' })
  @IsNotEmpty({ message: 'Название не должно быть пустым' })
  readonly name: string;

  @IsString({ message: 'Описание должно быть строкой' })
  @IsNotEmpty({ message: 'Описание не должно быть пустым' })
  readonly description: string;

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

  @IsOptional()
  @IsDefined({ message: 'Характеристики не должны быть пустыми' })
  readonly additionalCharacteristics: [string, string][];

  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: 'ID превью должен быть целым числом' },
  )
  @IsNotEmpty({ message: 'Отсутствует ID превью' })
  readonly previewImage: number;

  @ArrayMinSize(1, { message: 'Отсутствуют изображения товара' })
  @Validate(IsIntNumbers)
  images: number[];

  @IsOptional()
  @ArrayMinSize(1, { message: 'Отсутствуют примеры изделий' })
  @Validate(IsIntNumbers)
  examples: number[];

  @IsOptional()
  @ArrayMinSize(1, { message: 'Отсутствуют видео' })
  @Validate(IsStrings)
  videos: string[];

  @ArrayMinSize(1, { message: 'Отсутствует комплектация' })
  @Validate(IsStrings)
  equipments: string[];
}
