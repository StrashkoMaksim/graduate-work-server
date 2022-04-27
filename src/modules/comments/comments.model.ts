import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Order } from '../orders/orders.model';

interface CommentCreationAttrs {
  text: string;
  orderId: number;
}

@Table({ tableName: 'comments' })
export class Comment extends Model<Comment, CommentCreationAttrs> {
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
  text: string;

  @ForeignKey(() => Order)
  @Column({ type: DataType.INTEGER })
  orderID: number;
}
