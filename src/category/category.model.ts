import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Product } from '../products/products.model';
import { CategoryCharacteristics } from './category-characteristics.interface';

interface CategoryCreationAttrs {
  slug: string;
  name: string;
}

@Table({ tableName: 'categories' })
export class Category extends Model<Category, CategoryCreationAttrs> {
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
    type: DataType.JSONB,
  })
  characteristics: CategoryCharacteristics;

  @HasMany(() => Product)
  products: Product[];
}
