import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateProductDto } from './dto/create-product-dto';
import { Product, ProductCharacteristic } from './products.model';
import * as slug from 'slug';
import { CategoryService } from '../category/category.service';
import { CategoryCharacteristicsType } from '../category/category-characteristics.interface';
import { FilesService } from '../files/files.service';
import { Transaction } from 'sequelize';

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

  async createProducts(dto: CreateProductDto, transaction: Transaction) {
    const category = await this.categoryService.getCategoryById(dto.categoryId);

    if (!category) {
      throw new BadRequestException('Выбранной категории не существует');
    }

    const characteristics = this.validateCharacteristics(
      dto.characteristics,
      category,
    );

    const previewEntity = await this.filesService.getFileById(dto.previewImage);
    const previewImage = await this.filesService.saveImg(
      previewEntity.getDataValue('filename'),
      400,
    );

    const bigImages: string[] = [];
    const mediumImages: string[] = [];
    const smallImages: string[] = [];

    for (const imageId of dto.images) {
      const image = await this.filesService.getFileById(imageId);

      bigImages.push(await this.filesService.saveImg(image.filename, 1920));
      mediumImages.push(await this.filesService.saveImg(image.filename, 700));
      smallImages.push(
        await this.filesService.saveImg(image.filename, null, 60),
      );
    }

    const slugStr = await this.generateSlug(dto.name);

    const product = await this.productsRepository.create(
      {
        name: dto.name,
        price: dto.price,
        slug: slugStr,
        categoryId: dto.categoryId,
        characteristics,
        previewImage,
      },
      { transaction },
    );

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

  private async generateSlug(str) {
    let availableSlug = false;
    let slugCounter = 1;
    let slugStr = slug(str);

    while (!availableSlug) {
      const duplicatedCategoryBySlug = await this.getProductBySlug(slugStr);

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
