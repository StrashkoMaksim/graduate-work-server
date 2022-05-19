import { Body, Controller, Param, Put } from '@nestjs/common';
import { OrdersCartsService } from './orders-carts.service';
import { UpdateOrderCartDto } from './dto/update-order-cart-dto';
import { IdDto } from '../../validation/id-dto';

@Controller('orders-carts')
export class OrdersCartsController {
  constructor(private ordersCartsService: OrdersCartsService) {}

  @Put(':id')
  updateOrderCart(@Body() dto: UpdateOrderCartDto, @Param() orderId: IdDto) {
    return this.ordersCartsService.updateOrderCart(dto, orderId.id);
  }
}
