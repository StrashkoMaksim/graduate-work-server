import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ArticlesCategoriesService } from './articles-categories.service';
import { CreateArticlesCategoryDto } from './dto/create-articles-category-dto';
import { UpdateArticlesCategoryDto } from './dto/update-articles-category-dto';
import { IdDto } from '../../validation/id-dto';

@Controller('Articles-categories')
export class ArticlesCategoriesController {
  constructor(private articlesCategoriesService: ArticlesCategoriesService) {}

  @Get()
  getArticlesCategories() {
    return this.articlesCategoriesService.getArticlesCategories();
  }

  @Post()
  createArticlesCategory(@Body() dto: CreateArticlesCategoryDto) {
    return this.articlesCategoriesService.createArticlesCategory(dto);
  }

  @Put(':id')
  updateArticlesCategory(
    @Body() dto: UpdateArticlesCategoryDto,
    @Param() id: IdDto,
  ) {
    return this.articlesCategoriesService.updateArticlesCategory(dto, id);
  }

  @Delete()
  deleteArticlesCategory(@Param() id: IdDto) {
    return this.articlesCategoriesService.deleteArticlesCategory(id);
  }
}
