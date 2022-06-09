import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Product } from '../products.model';

interface ProductsVideosCreationAttrs {
  videoId: string;
  source: string;
  productId: number;
  title: string;
  smallPreview: string;
  mediumPreview: string;
  rawUrl: string;
}

export enum VideoSource {
  youtube = 'YOUTUBE',
  rutube = 'RUTUBE',
  dzen = 'DZEN',
}

@Table({ tableName: 'products_videos' })
export class ProductVideo extends Model<
  ProductVideo,
  ProductsVideosCreationAttrs
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
  videoId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  source: VideoSource;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  url: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  rawUrl: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  smallPreview: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  mediumPreview: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @ForeignKey(() => Product)
  @Column({ type: DataType.INTEGER, allowNull: false, onDelete: 'CASCADE' })
  productId: number;

  @BelongsTo(() => Product)
  product: Product;
}
