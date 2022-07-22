import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class OrderCartItem {
  @IsString({ message: 'Название товара должно быть строкой' })
  @IsNotEmpty({ message: 'Название товара не должно быть пустым' })
  readonly name: string;

  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: 'Количество товара должно быть целым числом' },
  )
  @IsNotEmpty({ message: 'Количество товара не должно быть пустым' })
  readonly count: number;

  @IsNumber({}, { message: 'Цена товара должна быть числом' })
  @IsNotEmpty({ message: 'Цена товара не должна быть пустым' })
  readonly price: number;
}
