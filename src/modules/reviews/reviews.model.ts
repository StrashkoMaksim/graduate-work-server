import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface ReviewsCreationAttrs {
  firstName: string;
  secondName: string;
  text: string;
}

@Table({ tableName: 'reviews' })
export class Review extends Model<Review, ReviewsCreationAttrs> {
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
  firstName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  secondName: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  text: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isAccepted: boolean;
}
