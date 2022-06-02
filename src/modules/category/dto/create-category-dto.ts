import {
  IsBoolean,
  IsDefined,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsString,
} from 'class-validator';
import { CategoryCharacteristics } from '../category-characteristics.interface';
import { ValidateCategoryCharacteristics } from '../validate-category-characteristics';

export class CreateCategoryDto {
  @IsString({ message: 'Название категории должно быть строкой' })
  @IsNotEmpty({ message: 'Название категории не должно быть пустым' })
  readonly name: string;

  @IsDefined({ message: 'Характеристики не должны быть пустыми' })
  @IsObject({ message: 'Характеристики должны быть объектом' })
  @IsNotEmptyObject({}, { message: 'Характеристики не должны быть пустыми' })
  @ValidateCategoryCharacteristics()
  readonly characteristics: CategoryCharacteristics;

  @IsBoolean({
    message:
      'Параметр видимости характеристики в карточке должен быть логического типа',
  })
  readonly isMain: boolean;
}
