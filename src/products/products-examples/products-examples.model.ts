import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Product } from '../products.model';

interface ProductsExamplesCreationAttrs {
  bigImage: string;
  smallImage: string;
  productId: number;
}

@Table({ tableName: 'products_examples' })
export class ProductExample extends Model<
  ProductExample,
  ProductsExamplesCreationAttrs
> {
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
  smallImage: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  bigImage: string;

  @ForeignKey(() => Product)
  @Column({ type: DataType.INTEGER, allowNull: false })
  productId: number;

  @BelongsTo(() => Product)
  product: Product;
}
