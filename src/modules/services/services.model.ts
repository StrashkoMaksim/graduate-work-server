import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Category } from '../category/category.model';

interface ServicesCreationAttrs {
  name: string;
  price: number;
  categoryId: number;
}

@Table({ tableName: 'services' })
export class Service extends Model<Service, ServicesCreationAttrs> {
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
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  price: number;

  @ForeignKey(() => Category)
  @Column({ type: DataType.INTEGER, allowNull: false, onDelete: 'RESTRICT' })
  categoryId: number;

  @BelongsTo(() => Category)
  category: Category;
}
