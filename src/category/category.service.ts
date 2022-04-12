import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category-dto';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from './category.model';
import * as slug from 'slug';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category) private categoryRepository: typeof Category,
  ) {}

  async getCategories() {
    const categories = await this.categoryRepository.findAll({
      include: { all: true },
    });
    return categories;
  }

  async createCategory(dto: CreateCategoryDto) {
    let availableSlug = false;
    let slugCounter = 1;
    let slugStr = slug(dto.name);

    while (!availableSlug) {
      const duplicatedCategoryBySlug = await this.getCategoryBySlug(slugStr);

      if (!duplicatedCategoryBySlug) {
        availableSlug = true;
      } else {
        slugStr = slug(`${dto.name}-${slugCounter}`);
        slugCounter++;
      }
    }

    const category = await this.categoryRepository.create({
      ...dto,
      slug: slugStr,
    });
    return category;
  }

  async getCategoryById(id: number) {
    return await this.categoryRepository.findByPk(id);
  }

  async getCategoryBySlug(slug: string) {
    const category = await this.categoryRepository.findOne({
      where: { slug },
      rejectOnEmpty: false,
    });
    return category;
  }
}
