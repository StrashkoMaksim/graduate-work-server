import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { IdDto } from '../../validation/id-dto';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-acticle-dto';
import { UpdateArticleDto } from './dto/update-acticle-dto';
import { JwtAuthGuard } from '../auth/jwt-auth-guard';
import { GetArticlesDto } from './dto/get-articles-dto';

@Controller('articles')
export class ArticlesController {
  constructor(private articlesService: ArticlesService) {}

  @Get()
  getArticles(@Query() dto: GetArticlesDto) {
    return this.articlesService.getArticles(dto);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createArticle(@Body() dto: CreateArticleDto) {
    return this.articlesService.createArticle(dto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  updateArticle(@Param() documentId: IdDto, @Body() dto: UpdateArticleDto) {
    return this.articlesService.updateArticle(dto, documentId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteArticle(@Param() dto: IdDto) {
    return this.articlesService.deleteArticle(dto);
  }
}
