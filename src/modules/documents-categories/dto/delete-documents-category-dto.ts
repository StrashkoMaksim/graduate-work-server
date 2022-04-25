import { IsDefined, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class DeleteDocumentsCategoryDto {
  @IsDefined({ message: 'Отсутствует идентификатор' })
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: 'Идентификатор должен быть целым числом' },
  )
  @Min(1, { message: 'Идентификатор должен быть больше или равен 1' })
  readonly id: number;
}
