import { Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { FilesModule } from '../files/files.module';
import { Article } from './articles.model';
import { ArticlesCategoriesModule } from '../articles-categories/articles-categories.module';

@Module({
  controllers: [ArticlesController],
  providers: [ArticlesService],
  imports: [
    SequelizeModule.forFeature([Article]),
    ArticlesCategoriesModule,
    FilesModule,
  ],
})
export class ArticlesModule {}
