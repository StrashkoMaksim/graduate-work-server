import { Module } from '@nestjs/common';
import { ArticlesController } from './articles.controller';
import { ArticlesService } from './articles.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { FilesModule } from '../files/files.module';
import { Article } from './articles.model';
import { ArticlesCategoriesModule } from '../articles-categories/articles-categories.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService } from '../JWT/jwt-config.service';

@Module({
  controllers: [ArticlesController],
  providers: [ArticlesService],
  imports: [
    SequelizeModule.forFeature([Article]),
    JwtModule.registerAsync({
      useClass: JwtConfigService,
    }),
    ArticlesCategoriesModule,
    FilesModule,
  ],
})
export class ArticlesModule {}
