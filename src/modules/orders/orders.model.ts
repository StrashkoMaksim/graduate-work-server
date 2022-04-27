import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Status } from '../statuses/statuses.model';
import { User } from '../users/users.model';
import { Source } from '../sources/sources.model';

interface OrderCreationAttrs {
  userID: number;
  statusID: number;
  sourceID: number;
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

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  userID: number;

  @ForeignKey(() => Status)
  @Column({ type: DataType.INTEGER })
  statusID: number;

  @ForeignKey(() => Source)
  @Column({ type: DataType.INTEGER })
  sourceID: number;
}
