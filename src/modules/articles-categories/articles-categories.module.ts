import { Module } from '@nestjs/common';
import { ArticlesCategoriesController } from './articles-categories.controller';
import { ArticlesCategoriesService } from './articles-categories.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ArticlesCategory } from './articles-categories.model';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService } from '../JWT/jwt-config.service';

@Module({
  controllers: [ArticlesCategoriesController],
  providers: [ArticlesCategoriesService],
  imports: [
    SequelizeModule.forFeature([ArticlesCategory]),
    JwtModule.registerAsync({
      useClass: JwtConfigService,
    }),
  ],
  exports: [ArticlesCategoriesService],
})
export class ArticlesCategoriesModule {}
