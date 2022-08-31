import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category-dto';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from './category.model';
import * as slug from 'slug';
import { UpdateCategoryDto } from './dto/update-category-dto';
import { CategoryCharacteristics } from './category-characteristics.interface';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category) private categoryRepository: typeof Category,
    @Inject(forwardRef(() => ProductsService))
    private productsService: ProductsService,
  ) {}

  async getCategories() {
    const categories = await this.categoryRepository.findAll();
    return categories;
  }

  async getMainCategories(): Promise<any[]> {
    const categories = await this.categoryRepository.findAll({
      where: {
        isMain: true,
      },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'isMain', 'characteristics'],
      },
      raw: true,
    });
    const categoriesWithProducts: any[] = [];
    for (const category of categories) {
      categoriesWithProducts.push({
        ...category,
        products: await this.productsService.getProducts({
          category: category.id,
          limit: 4,
          offset: 0,
          search: undefined,
        }),
      });
    }
    return categoriesWithProducts;
  }

  async createCategory(dto: CreateCategoryDto) {
    this.validateCharacteristicsMain(dto.characteristics);

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
      name: dto.name,
      characteristics: dto.characteristics,
      isMain: dto.isMain,
      slug: slugStr,
    });
    return category;
  }

  async updateCategory(id: number, dto: UpdateCategoryDto) {
    try {
      const category = await this.getCategoryById(id);
      if (!category) {
        throw new NotFoundException('Указанная категория не найдена');
      }

      if (dto.name) {
        category.name = dto.name;
        category.slug = await this.getAvailableSlug(dto.name);
      }

      if (dto.isMain !== undefined) {
        category.isMain = dto.isMain;
      }

      if (dto.characteristics) {
        const newNames = new Set(Object.keys(dto.characteristics));
        Object.keys(category.characteristics).forEach((name) => {
          if (newNames.has(name)) {
            throw new BadRequestException(
              `Характеристика с именем "${name}" уже существует`,
            );
          }
        });
        category.characteristics = {
          ...category.characteristics,
          ...dto.characteristics,
        };
        this.validateCharacteristicsMain(category.characteristics);
      }

      await category.save();
      return 'Категория успешно изменена';
    } catch (e) {
      throw new InternalServerErrorException('Непредвиденная ошибка сервера');
    }
  }

  async deleteCategory(id: number) {
    try {
      await this.categoryRepository.destroy({ where: { id } });
      return 'Категория успешно удалена';
    } catch (e) {
      if (
        e instanceof Error &&
        e.name === 'SequelizeForeignKeyConstraintError'
      ) {
        throw new BadRequestException(
          'Невозможно удалить категорию, внутри которой находятся товары и услуги',
        );
      }
      throw new InternalServerErrorException(
        'Непредвиденная ошибка при удалении',
      );
    }
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

  private async getAvailableSlug(name: string): Promise<string> {
    let availableSlug = false;
    let slugCounter = 1;
    let slugStr = slug(name);

    while (!availableSlug) {
      const duplicatedCategoryBySlug = await this.getCategoryBySlug(slugStr);

      if (!duplicatedCategoryBySlug) {
        availableSlug = true;
      } else {
        slugStr = slug(`${name}-${slugCounter}`);
        slugCounter++;
      }
    }
    return slugStr;
  }

  private validateCharacteristicsMain(
    characteristics: CategoryCharacteristics,
  ): void {
    let mainCount = 0;
    Object.entries(characteristics).forEach((entity) => {
      if (entity[1].isMain) mainCount++;
    });
    if (mainCount !== 2) {
      throw new BadRequestException('В карточке должно быть 2 характеристики');
    }
  }
}
