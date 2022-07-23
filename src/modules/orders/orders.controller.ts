import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth-guard';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order-dto';
import { GetOrdersDto } from './dto/get-orders-dto';
import { CreateOrderFromCartDto } from './dto/create-order-from-cart-dto';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getOrders(@Query() dto: GetOrdersDto) {
    return this.ordersService.getOrders(dto);
  }

  @Post()
  createOrder(@Body() dto: CreateOrderDto) {
    return this.ordersService.createOrder(dto);
  }

  @Post('/cart')
  createOrderFromCart(@Body() dto: CreateOrderFromCartDto) {
    return this.ordersService.createOrderFromCart(dto);
  }
}
