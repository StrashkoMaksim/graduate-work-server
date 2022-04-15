import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Category } from '../category/category.model';
import { ProductImage } from './products-images/products-images.model';
import { ProductExample } from './products-examples/products-examples.model';

interface ProductsCreationAttrs {
  slug: string;
  name: string;
  price: number;
  categoryId: number;
  characteristics: ProductCharacteristic;
  previewImage: string;
}

export interface ProductCharacteristic {
  [key: string]: string | number | boolean;
}

@Table({ tableName: 'products' })
export class Product extends Model<Product, ProductsCreationAttrs> {
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
  slug: string;

  @Column({
    type: DataType.STRING,
  })
  name: string;

  @Column({
    type: DataType.STRING,
  })
  previewImage: string;

  @Column({
    type: DataType.STRING,
  })
  videos: string;

  @HasMany(() => ProductImage)
  images: ProductImage[];

  @HasMany(() => ProductExample)
  examples: ProductExample[];

  @Column({
    type: DataType.DOUBLE,
  })
  price: number;

  @Column({ type: DataType.JSONB })
  characteristics: ProductCharacteristic;

  @ForeignKey(() => Category)
  @Column({ type: DataType.INTEGER })
  categoryId: number;

  @BelongsTo(() => Category)
  category: Category;
}
