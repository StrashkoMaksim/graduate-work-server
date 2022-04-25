import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { DocumentsCategory } from '../documents-categories/documents-categories.model';

interface DocumentCreationAttrs {
  name: string;
  type: string;
  link: string;
  categoryId: number;
}

@Table({ tableName: 'documents' })
export class Document extends Model<Document, DocumentCreationAttrs> {
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
  type: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  link: string;

  @ForeignKey(() => DocumentsCategory)
  @Column({ type: DataType.INTEGER })
  categoryId: number;
}
