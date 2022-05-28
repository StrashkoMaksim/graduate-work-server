import {
  IsDefined,
  IsJSON,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EditorBlocks } from '../editor-blocks';

export class CreateArticleDto {
  @IsString({ message: 'Название должно быть строкой' })
  @IsNotEmpty({ message: 'Название не должно быть пустым' })
  readonly name: string;

  @IsDefined({ message: 'Отсутствует идентификатор' })
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: 'Идентификатор должен быть целым числом' },
  )
  @Min(1, { message: 'Идентификатор должен быть больше или равен 1' })
  readonly previewImage: number;

  @IsString({ message: 'Текст превью должен быть строкой' })
  @IsNotEmpty({ message: 'Текст превью не должен быть пустым' })
  readonly previewText: string;

  // TODO: Сделать валидацию контента
  @IsNotEmpty({ message: 'Контент не должен быть пустым' })
  readonly content: EditorBlocks[];

  @IsDefined({ message: 'Отсутствует идентификатор' })
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: 'Идентификатор должен быть целым числом' },
  )
  @Min(1, { message: 'Идентификатор должен быть больше или равен 1' })
  readonly categoryId: number;
}
