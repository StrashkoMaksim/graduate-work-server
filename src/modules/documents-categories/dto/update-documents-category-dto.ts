import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateDocumentsCategoryDto {
  @IsDefined({ message: 'Отсутствует идентификатор' })
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: 'Идентификатор должен быть целым числом' },
  )
  @Min(1, { message: 'Идентификатор должен быть больше или равен 1' })
  readonly id: number;

  @IsString({ message: 'Название должно быть строкой' })
  @IsNotEmpty({ message: 'Название не должно быть пустым' })
  readonly name: string;
}
