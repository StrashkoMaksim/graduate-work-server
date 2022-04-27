import { Module } from '@nestjs/common';
import { OrdersCartsController } from './orders-carts.controller';
import { OrdersCartsService } from './orders-carts.service';

@Module({
  controllers: [OrdersCartsController],
  providers: [OrdersCartsService]
})
export class OrdersCartsModule {}
