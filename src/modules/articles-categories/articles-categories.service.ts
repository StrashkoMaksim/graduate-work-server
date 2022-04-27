import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ArticlesCategory } from './articles-categories.model';
import { CreateArticlesCategoryDto } from './dto/create-articles-category-dto';
import { UpdateArticlesCategoryDto } from './dto/update-articles-category-dto';
import * as slug from 'slug';
import { IdDto } from '../../validation/id-dto';

@Injectable()
export class ArticlesCategoriesService {
  constructor(
    @InjectModel(ArticlesCategory)
    private articlesCategoriesRepository: typeof ArticlesCategory,
  ) {}

  async getArticlesCategories() {
    return await this.articlesCategoriesRepository.findAll({
      include: { all: true },
    });
  }

  async createArticlesCategory(dto: CreateArticlesCategoryDto) {
    const slug = await this.getSlug(dto.name);

    await this.articlesCategoriesRepository.create({ ...dto, slug });
    return 'Категория статей успешно создана';
  }

  async updateArticlesCategory(dto: UpdateArticlesCategoryDto, id: IdDto) {
    const category = await this.articlesCategoriesRepository.findByPk(id.id);

    if (!category) {
      throw new NotFoundException('Указанная категория не найдена');
    }

    const slug = await this.getSlug(dto.name);

    await category.update({ name: dto.name, slug });

    return 'Категория статей успешно обновлена';
  }

  async deleteArticlesCategory(id: IdDto) {
    const category = await this.articlesCategoriesRepository.findByPk(id.id);
    if (category) {
      await category.destroy();
    }
    return 'Категория статей успешно удалена';
  }

  async getCategoryByPk(id: number) {
    return await this.articlesCategoriesRepository.findByPk(id);
  }

  async getCategoryBySlug(slug: string) {
    const category = await this.articlesCategoriesRepository.findOne({
      where: { slug },
      rejectOnEmpty: false,
    });
    return category;
  }

  private async getSlug(str: string) {
    let availableSlug = false;
    let slugCounter = 1;
    let slugStr = slug(str);

    while (!availableSlug) {
      const duplicatedCategoryBySlug = await this.getCategoryBySlug(slugStr);

      if (!duplicatedCategoryBySlug) {
        availableSlug = true;
      } else {
        slugStr = slug(`${str}-${slugCounter}`);
        slugCounter++;
      }
    }

    return slugStr;
  }
}
