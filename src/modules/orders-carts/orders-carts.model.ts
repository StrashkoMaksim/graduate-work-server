import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Order } from '../orders/orders.model';

interface OrdersCartCreationAttrs {
  productName: string;
  count: number;
  orderId: number;
}

@Table({ tableName: 'orders_carts' })
export class OrdersCart extends Model<OrdersCart, OrdersCartCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  productName: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  count: number;

  @ForeignKey(() => Order)
  @Column({ type: DataType.INTEGER })
  orderID: number;
}
