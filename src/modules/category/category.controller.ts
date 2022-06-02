import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category-dto';
import { UpdateCategoryDto } from './dto/update-category-dto';
import { IdDto } from '../../validation/id-dto';
import { SlugDto } from '../../validation/slug-dto';

@Controller('categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  getCategories() {
    return this.categoryService.getCategories();
  }

  @Get('/:slug')
  getCategoryBySlug(@Param() slug: SlugDto) {
    return this.categoryService.getCategoryBySlug(slug.slug);
  }

  @Post()
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.categoryService.createCategory(dto);
  }

  @Put('/:id')
  updateCategory(@Param() id: IdDto, @Body() dto: UpdateCategoryDto) {
    return this.categoryService.updateCategory(id.id, dto);
  }

  @Delete('/:id')
  deleteCategory(@Param() id: IdDto) {
    return this.categoryService.deleteCategory(id.id);
  }
}
