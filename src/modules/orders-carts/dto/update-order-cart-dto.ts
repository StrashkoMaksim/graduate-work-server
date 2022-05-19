import { IsDefined, IsNumber, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderCartItemDto } from './order-cart-item-dto';

export class UpdateOrderCartDto {
  @ValidateNested({ each: true })
  @Type(() => OrderCartItemDto)
  readonly cart: OrderCartItemDto[];
}
