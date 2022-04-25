import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDocumentWithLinkDto {
  @IsString({ message: 'Название должно быть строкой' })
  @IsNotEmpty({ message: 'Название не должно быть пустым' })
  readonly name: string;

  @IsUrl({}, { message: 'Некорректная ссылка' })
  readonly link: string;

  @IsDefined({ message: 'Отсутствует идентификатор' })
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: 'Идентификатор должен быть целым числом' },
  )
  @Min(1, { message: 'Идентификатор должен быть больше или равен 1' })
  readonly categoryId: number;
}
