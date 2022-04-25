import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Document } from '../documents/documents.model';

interface DocumentCategoryCreationAttrs {
  name: string;
}

@Table({ tableName: 'documents-categories' })
export class DocumentsCategory extends Model<
  DocumentsCategory,
  DocumentCategoryCreationAttrs
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
  name: string;

  @HasMany(() => Document)
  documents: Document[];
}
