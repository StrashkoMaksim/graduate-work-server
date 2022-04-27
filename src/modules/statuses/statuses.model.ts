import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface StatusCreationAttrs {
  name: string;
}

@Table({ tableName: 'statuses' })
export class Status extends Model<Status, StatusCreationAttrs> {
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
    unique: true,
  })
  name: string;
}
