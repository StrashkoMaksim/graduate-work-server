import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put, UseGuards,
} from '@nestjs/common';
import { ArticlesCategoriesService } from './articles-categories.service';
import { CreateArticlesCategoryDto } from './dto/create-articles-category-dto';
import { UpdateArticlesCategoryDto } from './dto/update-articles-category-dto';
import { IdDto } from '../../validation/id-dto';
import { JwtAuthGuard } from '../auth/jwt-auth-guard';

@Controller('articles-categories')
export class ArticlesCategoriesController {
  constructor(private articlesCategoriesService: ArticlesCategoriesService) {}

  @Get()
  getArticlesCategories() {
    return this.articlesCategoriesService.getArticlesCategories();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createArticlesCategory(@Body() dto: CreateArticlesCategoryDto) {
    return this.articlesCategoriesService.createArticlesCategory(dto);
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard)
  updateArticlesCategory(
    @Body() dto: UpdateArticlesCategoryDto,
    @Param() id: IdDto,
  ) {
    return this.articlesCategoriesService.updateArticlesCategory(dto, id);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  deleteArticlesCategory(@Param() id: IdDto) {
    return this.articlesCategoriesService.deleteArticlesCategory(id);
  }
}
