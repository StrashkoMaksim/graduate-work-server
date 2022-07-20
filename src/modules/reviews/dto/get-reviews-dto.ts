import { IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetReviewsDto {
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
}
