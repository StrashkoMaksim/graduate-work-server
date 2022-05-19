import { Module } from '@nestjs/common';
import { OrdersCartsController } from './orders-carts.controller';
import { OrdersCartsService } from './orders-carts.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrdersCart } from './orders-carts.model';
import { OrdersModule } from '../orders/orders.module';

@Module({
  controllers: [OrdersCartsController],
  providers: [OrdersCartsService],
  imports: [SequelizeModule.forFeature([OrdersCart]), OrdersModule],
})
export class OrdersCartsModule {}
