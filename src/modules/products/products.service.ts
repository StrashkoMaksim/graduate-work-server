import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateProductDto } from './dto/create-product-dto';
import { Product, ProductCharacteristic } from './products.model';
import * as slug from 'slug';
import { CategoryService } from '../category/category.service';
import { CategoryCharacteristicsType } from '../category/category-characteristics.interface';
import { FilesService } from '../files/files.service';
import { Transaction } from 'sequelize';
import { ProductsImagesService } from './products-images/products-images.service';
import { ProductsExamplesService } from './products-examples/products-examples.service';
import { ProductsVideosService } from './products-videos/products-videos.service';
import { GetProductsDto } from './dto/get-products-dto';
import { Category } from '../category/category.model';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product) private productsRepository: typeof Product,
    private categoryService: CategoryService,
    private filesService: FilesService,
    private productImagesService: ProductsImagesService,
    private productExamplesService: ProductsExamplesService,
    private productVideosService: ProductsVideosService,
  ) {}

  async getProducts(dto: GetProductsDto): Promise<any[]> {
    const products = await this.productsRepository.findAll({
      [dto.category && 'where']: { categoryId: dto.category },
      limit: dto.limit,
      offset: dto.offset,
      attributes: {
        include: [
          'id',
          'name',
          'price',
          'previewImage',
          'categoryId',
          'createdAt',
        ],
      },
      include: {
        model: Category,
        attributes: ['characteristics'],
      },
      order: [['createdAt', 'DESC']],
      raw: true,
    });

    const resultProducts = products.map((product) => {
      const characteristics: ProductCharacteristic = {};
      Object.entries(product.characteristics).forEach((entry, index) => {
        if (product['category.characteristics'][entry[0]].isMain) {
          characteristics[entry[0]] = entry[1];
        }
      });

      return {
        ...product,
        characteristics,
        'category.characteristics': undefined,
      };
    });

    return resultProducts;
  }

  async getAllSlugs() {
    const articles = await this.productsRepository.findAll({
      attributes: ['slug'],
    });
    return articles;
  }

  async createProducts(dto: CreateProductDto, transaction: Transaction) {
    let previewImage = '';

    try {
      const category = await this.categoryService.getCategoryById(
        dto.categoryId,
      );

      if (!category) {
        throw new BadRequestException('Выбранной категории не существует');
      }

      // Валидация характеристик
      const characteristics = this.validateCharacteristics(
        dto.characteristics,
        category,
      );

      // Сохранение изображения превью
      const previewEntity = await this.filesService.getFileById(
        dto.previewImage,
      );
      previewImage = await this.filesService.saveImg(
        previewEntity.getDataValue('filename'),
        400,
      );

      // Уникальное название для URL
      const slugStr = await this.generateSlug(dto.name);

      const product = await this.productsRepository.create(
        {
          name: dto.name,
          price: dto.price,
          slug: slugStr,
          categoryId: dto.categoryId,
          characteristics,
          previewImage,
          description: dto.description,
          equipments: dto.equipments,
        },
        { transaction },
      );

      // Добавление видео
      if (dto.videos) {
        const videos = await this.productVideosService.createVideos(
          product.id,
          dto.videos,
          transaction,
        );
        await product.$set(
          'videos',
          videos.map((el) => el.id),
        );
        product.videos = videos;
      }

      // Добавление изображений
      const images = await this.productImagesService.createImages(
        product.id,
        dto.images,
        transaction,
      );
      await product.$set(
        'images',
        images.map((el) => el.id),
      );
      product.images = images;

      // Добавление примеров работ
      if (dto.examples) {
        const examples = await this.productExamplesService.createExamples(
          product.id,
          dto.examples,
          transaction,
        );
        await product.$set(
          'examples',
          examples.map((el) => el.id),
        );
        product.examples = examples;
      }

      return { message: 'Товар успешно добавлен' };
    } catch (e) {
      if (previewImage) {
        this.filesService.deleteFile(
          process.env.STATIC_PATH + '\\images\\' + previewImage,
        );
      }
      // TODO: удалять изображения при ошибке
      if (e instanceof HttpException) {
        throw e;
      } else {
        console.error(e);
        throw new InternalServerErrorException('Непредвиденная ошибка сервера');
      }
    }
  }

  async getProductForEditing(slug: string) {
    const product = await this.getProductBySlug(slug, true);
    const category = await this.categoryService.getCategoryById(
      product.categoryId,
    );

    const characteristics = {};
    Object.entries(category.characteristics).forEach((entry) => {
      characteristics[entry[0]] = {
        value: product.characteristics[entry[0]],
        type: entry[1].type,
      };
    });
    const images = product.images.map((image) => {
      return {
        id: image.id,
        filename: image.mediumImage,
      };
    });
    const examples = product.examples.map((image) => {
      return {
        id: image.id,
        filename: image.bigImage,
      };
    });

    return {
      id: product.id,
      name: {
        value: product.name,
        isChanged: false,
      },
      description: {
        value: product.description,
        isChanged: false,
      },
      price: {
        value: String(product.price),
        isChanged: false,
      },
      previewImage: {
        filename: product.previewImage,
      },
      category: {
        id: product.categoryId,
        isChanged: false,
      },
      characteristics,
      isCharacteristicsChanged: false,
      images,
      deletedImages: [],
      equipments: product.equipments,
      examples,
      deletedExamples: [],
      videos: product.videos.map((video) => video.url),
    };
  }

  async deleteProduct(id: number) {
    const imagesForDelete: string[] = [];
    const product = await this.productsRepository.findByPk(id, {
      include: ['images', 'examples'],
    });

    imagesForDelete.push(product.previewImage);
    product.images.forEach((image) => {
      imagesForDelete.push(image.bigImage);
      imagesForDelete.push(image.mediumImage);
      imagesForDelete.push(image.smallImage);
    });
    product.examples.forEach((image) => {
      imagesForDelete.push(image.bigImage);
      imagesForDelete.push(image.smallImage);
    });

    await product.destroy();

    imagesForDelete.forEach((image) =>
      this.filesService.deleteFile(
        `${process.env.STATIC_PATH}/images/${image}`,
      ),
    );
    return 'Товар успешно удален';
  }

  private async getProductBySlug(slug: string, deep?: boolean) {
    const product = await this.productsRepository.findOne({
      where: { slug },
      rejectOnEmpty: false,
      [deep && 'include']: ['images', 'videos', 'examples'],
    });
    return product;
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
