import { IsNumber } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class GetCartDto {
  @Type(() => Number)
  @IsNumber(
    {},
    { each: true, message: 'Каждый ID должен быть положительным целым числом' },
  )
  @Transform(({ value, options }) => {
    if (!Array.isArray(value)) {
      return [value];
    } else {
      return value;
    }
  })
  readonly ids: number[];
}
