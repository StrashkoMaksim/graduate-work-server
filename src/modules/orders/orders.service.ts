import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Order } from './orders.model';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order) private ordersRepository: typeof Order
  ) {}

  async findByPk(id: number) {
    return await this.ordersRepository.findByPk(id);
  }
}
