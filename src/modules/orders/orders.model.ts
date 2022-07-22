import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Status } from '../statuses/statuses.model';
import { Source } from '../sources/sources.model';
import { Comment } from '../comments/comments.model';
import { OrderCartItem } from './dto/order-cart-item';

interface OrderCreationAttrs {
  fio: string;
  phone: string;
  priceSum: number;
  cart: OrderCartItem[];
  statusId: number;
  sourceId: number;
}

@Table({ tableName: 'orders' })
export class Order extends Model<Order, OrderCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  fio: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phone: string;

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
  })
  priceSum: number;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  cart: OrderCartItem[];

  @ForeignKey(() => Status)
  @Column({ type: DataType.INTEGER })
  statusId: number;

  @ForeignKey(() => Source)
  @Column({ type: DataType.INTEGER })
  sourceId: number;

  @BelongsTo(() => Source)
  source: Source;

  @BelongsTo(() => Status)
  status: Status;

  @HasMany(() => Comment)
  comments: Comment[];
}
