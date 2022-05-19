import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class OrderCartItemDto {
  @IsString({ message: 'Название должно быть строкой' })
  @IsNotEmpty({ message: 'Название не должно быть пустым' })
  productName: string;

  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: 'Количество должно быть целым числом' },
  )
  @Min(1, { message: 'Количество должно быть больше или равно 1' })
  count: number;
}
