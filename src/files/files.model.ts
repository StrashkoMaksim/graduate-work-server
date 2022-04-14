import { Column, DataType, Model, Table } from 'sequelize-typescript';

interface FilesCreationAttrs {
  filename: string;
}

@Table({ tableName: 'files' })
export class File extends Model<File, FilesCreationAttrs> {
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
  filename: string;
}
