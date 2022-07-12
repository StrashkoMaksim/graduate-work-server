import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface BannersCreationAttrs {
  name: string;
  bigImage: string;
  mediumImage: string;
  smallImage: string;
  link: string;
}

@Table({ tableName: 'banners' })
export class Banner extends Model<Banner, BannersCreationAttrs> {
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
  smallImage: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  mediumImage: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  bigImage: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  link: string;
}
