import { Injectable, NotFoundException } from '@nestjs/common';
import { OrdersCart } from './orders-carts.model';
import { OrdersService } from '../orders/orders.service';
import { InjectModel } from '@nestjs/sequelize';
import { UpdateOrderCartDto } from './dto/update-order-cart-dto';

@Injectable()
export class OrdersCartsService {
  constructor(
    @InjectModel(OrdersCart) private cartRepository: typeof OrdersCart,
    private ordersService: OrdersService,
  ) {}

  async createOrderCart(dto) {
    return 'Товар добавлен в корзину';
  }

  async updateOrderCart(dto: UpdateOrderCartDto, orderId: number) {
    const order = await this.ordersService.findByPk(orderId);

    if (!order) {
      throw new NotFoundException('Указанного заказа не существует');
    }

    await this.cartRepository.create(
      dto.cart.map((el) => {
        return { ...el, orderId };
      }),
    );

    return 'Корзина обновлена';
  }
}
