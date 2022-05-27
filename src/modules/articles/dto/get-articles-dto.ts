import { IsOptional, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetArticlesDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: 'Количество должно быть целым числом' },
  )
  @Min(0, { message: 'Количество должно быть больше или равно 0' })
  readonly limit: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: 'Отступ должен быть целым числом' },
  )
  @Min(0, { message: 'Отступ должен быть больше или равен 0' })
  readonly offset: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: 'ID категории должен быть целым числом' },
  )
  @Min(0, { message: 'ID категории должен быть больше или равен 0' })
  readonly category: number;
}
