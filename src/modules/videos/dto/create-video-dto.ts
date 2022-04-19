import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVideoDto {
  @IsString({ message: 'Название должно быть строкой' })
  @IsNotEmpty({ message: 'Название не должно быть пустым' })
  readonly title: string;

  @IsString({ message: 'Ссылка должна быть строкой' })
  @IsNotEmpty({ message: 'Ссылка не должна быть пустой' })
  readonly link: string;

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
