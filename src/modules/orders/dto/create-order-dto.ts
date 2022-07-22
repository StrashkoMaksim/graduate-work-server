import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderCartItem } from './order-cart-item';

export class CreateOrderDto {
  @IsString({ message: 'ФИО должно быть строкой' })
  @IsNotEmpty({ message: 'ФИО не должно быть пустым' })
  readonly fio: string;

  @IsString({ message: 'Номер телефона должен быть строкой' })
  @IsNotEmpty({ message: 'Номер телефона не должен быть пустым' })
  @Length(18, 18, {
    message: 'Телефон должен иметь формат "+7 (999) 999-99-99"',
  })
  readonly phone: string;

  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: 'ID источника должен быть числом' },
  )
  @IsNotEmpty({ message: 'ID источника не должен быть пустым' })
  readonly sourceId: number;

  @IsNumber(
    { maxDecimalPlaces: 0 },
    { message: 'ID статуса должен быть числом' },
  )
  @IsNotEmpty({ message: 'ID статуса не должен быть пустым' })
  readonly statusId: number;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => OrderCartItem)
  readonly cart: OrderCartItem[];
}
