import { Module } from '@nestjs/common';
import { ArticlesCategoriesController } from './articles-categories.controller';
import { ArticlesCategoriesService } from './articles-categories.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ArticlesCategory } from './articles-categories.model';

@Module({
  controllers: [ArticlesCategoriesController],
  providers: [ArticlesCategoriesService],
  imports: [SequelizeModule.forFeature([ArticlesCategory])],
  exports: [ArticlesCategoriesService],
})
export class ArticlesCategoriesModule {}
