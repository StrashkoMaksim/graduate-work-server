import { Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { ArticlesCategory } from '../articles-categories/articles-categories.model';

interface ArticleCreationAttrs {
  name: string;
  slug: string;
  previewImage: string;
  previewText: string;
  content: string;
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
    type: DataType.TEXT,
    allowNull: false,
  })
  content: string;

  @ForeignKey(() => ArticlesCategory)
  @Column({ type: DataType.INTEGER })
  categoryId: number;
}
