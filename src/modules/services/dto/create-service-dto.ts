import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateServiceDto {
  @IsString({ message: 'Название должно быть строкой' })
  @IsNotEmpty({ message: 'Название не должно быть пустым' })
  readonly name: string;

  @IsNumber({ maxDecimalPlaces: 0 }, { message: 'Цена должна быть числом' })
  @IsNotEmpty({ message: 'Цена не должна быть пустой' })
  readonly price: number;

  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: 'Номер категории должен быть числом' },
  )
  @IsNotEmpty({ message: 'Номер категории не должен быть пустым' })
  readonly categoryId: number;
}
