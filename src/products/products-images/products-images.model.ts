import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Product } from '../products.model';

interface ProductsImagesCreationAttrs {
  preview: string;
  image: string;
  productId: number;
}

@Table({ tableName: 'products_images' })
export class ProductImage extends Model<
  ProductImage,
  ProductsImagesCreationAttrs
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
    unique: true,
  })
  preview: string;

  @Column({
    type: DataType.STRING,
  })
  image: string;

  @ForeignKey(() => Product)
  @Column({ type: DataType.INTEGER })
  productId: number;

  @BelongsTo(() => Product)
  product: Product;
}
