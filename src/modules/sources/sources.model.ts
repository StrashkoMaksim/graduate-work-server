import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface SourceCreationAttrs {
  name: string;
}

@Table({ tableName: 'sources' })
export class Source extends Model<Source, SourceCreationAttrs> {
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

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  isDeletable: boolean;
}
