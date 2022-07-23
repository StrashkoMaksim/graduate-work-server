import { IsNotEmptyObject } from 'class-validator';
import { CreateOrderDto } from './create-order-dto';
import { OmitType } from '@nestjs/swagger';

export class CreateOrderFromCartDto extends OmitType(CreateOrderDto, [
  'cart',
  'question',
] as const) {
  @IsNotEmptyObject({}, { message: 'Корзина не должна быть пустой' })
  cart: { [key: number]: number };
}
