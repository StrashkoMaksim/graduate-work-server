import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Article } from '../articles/articles.model';

interface ArticlesCategoryCreationAttrs {
  name: string;
  slug: string;
}

@Table({ tableName: 'articles-categories' })
export class ArticlesCategory extends Model<
  ArticlesCategory,
  ArticlesCategoryCreationAttrs
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

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  slug: string;

  @HasMany(() => Article)
  articles: Article[];
}
