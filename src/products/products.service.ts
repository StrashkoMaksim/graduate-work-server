import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateProductDto } from './dto/create-product-dto';
import { Product, ProductCharacteristic } from './products.model';
import * as slug from 'slug';
import { CategoryService } from '../category/category.service';
import { CategoryCharacteristicsType } from '../category/category-characteristics.interface';
import { FilesService } from '../files/files.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product) private productsRepository: typeof Product,
    private categoryService: CategoryService,
    private filesService: FilesService,
  ) {}

  async getProducts() {
    return await this.productsRepository.findAll();
  }

  async createProducts(dto: CreateProductDto) {
    const category = await this.categoryService.getCategoryById(dto.categoryId);

    if (!category) {
      throw new BadRequestException('Выбранной категории не существует');
    }

    const characteristics = this.validateCharacteristics(
      dto.characteristics,
      category,
    );

    let availableSlug = false;
    let slugCounter = 1;
    let slugStr = slug(dto.name);

    while (!availableSlug) {
      const duplicatedCategoryBySlug = await this.getProductBySlug(slugStr);

      if (!duplicatedCategoryBySlug) {
        availableSlug = true;
      } else {
        slugStr = slug(`${dto.name}-${slugCounter}`);
        slugCounter++;
      }
    }

    const previewImage = await this.filesService.saveImg(dto.images[0], 300);

    const product = await this.productsRepository.create({
      name: dto.name,
      price: dto.price,
      slug: slugStr,
      categoryId: dto.categoryId,
      characteristics,
      previewImage,
    });



    return product;
  }

  async getProductBySlug(slug: string) {
    const category = await this.productsRepository.findOne({
      where: { slug },
      rejectOnEmpty: false,
    });
    return category;
  }

  private validateCharacteristics(
    characteristics: ProductCharacteristic,
    category,
  ) {
    const resultCharacteristics = {};

    for (const field of Object.entries(category.characteristics)) {
      if (!characteristics.hasOwnProperty(field[0])) {
        throw new BadRequestException(`Отсутствует характеристика ${field[0]}`);
      }

      const value = characteristics[field[0]];
      switch (field[1]) {
        case CategoryCharacteristicsType.String:
          if (typeof value !== 'string') {
            throw new BadRequestException(
              `Характеристика ${field[0]} должна быть строкой`,
            );
          }
          break;
        case CategoryCharacteristicsType.Integer:
          if (typeof value !== 'number' || !Number.isInteger(value)) {
            throw new BadRequestException(
              `Характеристика ${field[0]} должна быть целым числом`,
            );
          }
          break;
        case CategoryCharacteristicsType.Double:
          if (typeof value !== 'number') {
            throw new BadRequestException(
              `Характеристика ${field[0]} должна быть числом`,
            );
          }
          break;
        case CategoryCharacteristicsType.Boolean:
          if (typeof value !== 'boolean') {
            throw new BadRequestException(
              `Характеристика ${field[0]} должна быть логического типа`,
            );
          }
          break;
        default:
      }
      resultCharacteristics[field[0]] = value;
    }
    return resultCharacteristics;
  }
}
