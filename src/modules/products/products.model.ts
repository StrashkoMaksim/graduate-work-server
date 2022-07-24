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
import { ProductVideo } from './products-videos/products-videos.model';

interface ProductsCreationAttrs {
  slug: string;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  characteristics: ProductCharacteristic;
  additionalCharacteristics: [string, string][];
  previewImage: string;
  equipments: string[];
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
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  previewImage: string;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  equipments: string[];

  @HasMany(() => ProductVideo)
  videos: ProductVideo[];

  @HasMany(() => ProductImage)
  images: ProductImage[];

  @HasMany(() => ProductExample)
  examples: ProductExample[];

  @Column({
    type: DataType.DOUBLE,
    allowNull: false,
  })
  price: number;

  @Column({ type: DataType.JSONB, allowNull: false })
  characteristics: ProductCharacteristic;

  @Column({ type: DataType.JSONB, allowNull: false })
  additionalCharacteristics: [string, string][];

  @ForeignKey(() => Category)
  @Column({ type: DataType.INTEGER, allowNull: false, onDelete: 'RESTRICT' })
  categoryId: number;

  @BelongsTo(() => Category)
  category: Category;
}
