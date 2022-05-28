import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { ArticlesCategory } from '../articles-categories/articles-categories.model';
import { EditorBlocks } from './editor-blocks';

interface ArticleCreationAttrs {
  name: string;
  slug: string;
  previewImage: string;
  previewText: string;
  content: EditorBlocks[];
}

@Table({ tableName: 'articles' })
export class Article extends Model<Article, ArticleCreationAttrs> {
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
    unique: true,
  })
  slug: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  previewImage: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  previewText: string;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  content: EditorBlocks[];

  @ForeignKey(() => ArticlesCategory)
  @Column({ type: DataType.INTEGER, onDelete: 'RESTRICT' })
  categoryId: number;
}
