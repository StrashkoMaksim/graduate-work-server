import { Body, Controller, Get, Param, Post, Put, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth-guard';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order-dto';
import { GetOrdersDto } from './dto/get-orders-dto';
import { CreateOrderFromCartDto } from './dto/create-order-from-cart-dto';
import { TransactionInterceptor } from '../../transaction/transaction.interceptor';
import { IdDto } from '../../validation/id-dto';
import { UpdateOrderDto } from './dto/update-order-dto';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getOrders(@Query() dto: GetOrdersDto) {
    return this.ordersService.getOrders(dto);
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  getOrder(@Param() id: IdDto) {
    return this.ordersService.getOrder(id.id);
  }

  @Post()
  @UseInterceptors(TransactionInterceptor)
  createOrder(@Body() dto: CreateOrderDto, @Req() req) {
    return this.ordersService.createOrder(dto, req.transaction);
  }

  @Post('/cart')
  createOrderFromCart(@Body() dto: CreateOrderFromCartDto) {
    return this.ordersService.createOrderFromCart(dto);
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  updateOrder(@Param() id: IdDto, @Body() dto: UpdateOrderDto) {
    return this.ordersService.updateOrder(id.id, dto);
  }
}
