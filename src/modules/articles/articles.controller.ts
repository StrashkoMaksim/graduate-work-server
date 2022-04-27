import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { IdDto } from '../../validation/id-dto';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-acticle-dto';
import { UpdateArticleDto } from './dto/update-acticle-dto';

@Controller('articles')
export class ArticlesController {
  constructor(private articlesService: ArticlesService) {}

  @Post()
  createArticle(@Body() dto: CreateArticleDto) {
    return this.articlesService.createArticle(dto);
  }

  @Put(':id')
  updateDocumentWithLink(
    @Param() documentId: IdDto,
    @Body() dto: UpdateArticleDto,
  ) {
    return this.articlesService.updateArticle(dto, documentId);
  }

  @Delete(':id')
  deleteDocument(@Param() dto: IdDto) {
    return this.articlesService.deleteArticle(dto);
  }
}
