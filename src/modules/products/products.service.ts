import {
  BadRequestException,
  forwardRef,
  HttpException,
  Inject,
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
import { Op, Transaction } from 'sequelize';
import { ProductsImagesService } from './products-images/products-images.service';
import { ProductsExamplesService } from './products-examples/products-examples.service';
import { ProductsVideosService } from './products-videos/products-videos.service';
import { GetProductsDto } from './dto/get-products-dto';
import { Category } from '../category/category.model';
import { UpdateProductDto } from './dto/update-product-dto';
import { GetCartDto } from './dto/get-cart-dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product) private productsRepository: typeof Product,
    @Inject(forwardRef(() => CategoryService))
    private categoryService: CategoryService,
    private filesService: FilesService,
    private productImagesService: ProductsImagesService,
    private productExamplesService: ProductsExamplesService,
    private productVideosService: ProductsVideosService,
  ) {}

  async getProducts(dto: GetProductsDto): Promise<any[]> {
    const where: any = {};

    if (dto.category) {
      where.categoryId = dto.category;
    }

    if (dto.search) {
      where[Op.or] = [{ name: { [Op.like]: `%${dto.search}%` } }];
    }

    const products = await this.productsRepository.findAll({
      where,
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
    const products = await this.productsRepository.findAll({
      attributes: ['slug'],
    });
    return products;
  }

  async createProducts(dto: CreateProductDto, transaction: Transaction) {
    const deleteOnError: string[] = [];
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
      const previewImage = await this.filesService.saveImg(
        previewEntity.getDataValue('filename'),
        400,
        410,
      );
      deleteOnError.push(previewImage);

      // Уникальное название для URL
      const slugStr = await this.generateSlug(dto.name);

      const product = await this.productsRepository.create(
        {
          name: dto.name,
          price: dto.price,
          slug: slugStr,
          categoryId: dto.categoryId,
          characteristics,
          additionalCharacteristics: dto.additionalCharacteristics,
          previewImage,
          description: dto.description,
          equipments: dto.equipments,
        },
        { transaction },
      );

      // Добавление видео
      if (dto.videos) {
        await this.productVideosService.createVideos(
          product.id,
          dto.videos,
          transaction,
        );
      }

      // Добавление изображений
      const images = await this.productImagesService.createImages(
        product.id,
        dto.images,
        transaction,
      );
      images.forEach((image) => {
        deleteOnError.push(image.bigImage);
        deleteOnError.push(image.mediumImage);
        deleteOnError.push(image.smallImage);
      });

      // Добавление примеров работ
      if (dto.examples) {
        const examples = await this.productExamplesService.createExamples(
          product.id,
          dto.examples,
          transaction,
        );
        examples.forEach((image) => {
          deleteOnError.push(image.bigImage);
          deleteOnError.push(image.smallImage);
        });
      }

      return { message: 'Товар успешно добавлен' };
    } catch (e) {
      deleteOnError.forEach((image) =>
        this.filesService.deleteFile(
          `${process.env.STATIC_PATH}/images/${image}`,
        ),
      );
      if (e instanceof HttpException) {
        throw e;
      } else {
        console.error(e);
        throw new InternalServerErrorException('Непредвиденная ошибка сервера');
      }
    }
  }

  async updateProduct(
    id: number,
    dto: UpdateProductDto,
    transaction: Transaction,
  ) {
    const deleteOnError: string[] = [];

    try {
      const imagesForDelete: string[] = [];
      const product = await this.productsRepository.findByPk(id, {
        include: ['images', 'examples'],
      });

      if (dto.name) {
        product.name = dto.name;
      }

      if (dto.description) {
        product.description = dto.description;
      }

      if (dto.price) {
        product.price = dto.price;
      }

      if (dto.previewImage) {
        imagesForDelete.push(product.previewImage);
        const previewEntity = await this.filesService.getFileById(
          dto.previewImage,
        );
        const newPreviewImage = await this.filesService.saveImg(
          previewEntity.getDataValue('filename'),
          400,
          410,
        );
        deleteOnError.push(newPreviewImage);
        product.previewImage = newPreviewImage;
      }

      if (dto.equipments) {
        product.equipments = dto.equipments;
      }

      if (dto.characteristics) {
        const category = await this.categoryService.getCategoryById(
          product.categoryId,
        );
        const characteristics = this.validateCharacteristics(
          dto.characteristics,
          category,
        );
        product.characteristics = characteristics;
      }

      if (dto.additionalCharacteristics) {
        product.additionalCharacteristics = dto.additionalCharacteristics;
      }

      if (dto.deletedImages) {
        const set = new Set<number>(dto.deletedImages);
        for (const image of product.images) {
          if (set.has(image.id)) {
            imagesForDelete.push(image.bigImage);
            imagesForDelete.push(image.mediumImage);
            imagesForDelete.push(image.smallImage);
            await this.productImagesService.deleteImageById(
              image.id,
              transaction,
            );
          }
        }
      }

      if (dto.deletedExamples) {
        const set = new Set<number>(dto.deletedExamples);
        for (const image of product.examples) {
          if (set.has(image.id)) {
            imagesForDelete.push(image.bigImage);
            imagesForDelete.push(image.smallImage);
            await this.productExamplesService.deleteExampleById(
              image.id,
              transaction,
            );
          }
        }
      }

      if (dto.images) {
        const images = await this.productImagesService.createImages(
          product.id,
          dto.images,
          transaction,
        );
        images.forEach((image) => {
          deleteOnError.push(image.bigImage);
          deleteOnError.push(image.mediumImage);
          deleteOnError.push(image.smallImage);
        });
      }

      if (dto.examples) {
        const examples = await this.productExamplesService.createExamples(
          product.id,
          dto.examples,
          transaction,
        );
        examples.forEach((image) => {
          deleteOnError.push(image.bigImage);
          deleteOnError.push(image.smallImage);
        });
      }

      if (dto.videos) {
        await this.productVideosService.deleteVideos(product.id, transaction);
        await this.productVideosService.createVideos(
          product.id,
          dto.videos,
          transaction,
        );
      }

      await product.save({ transaction });

      imagesForDelete.forEach((image) =>
        this.filesService.deleteFile(
          `${process.env.STATIC_PATH}/images/${image}`,
        ),
      );
      return 'Товар успешно изменен';
    } catch (e) {
      deleteOnError.forEach((image) =>
        this.filesService.deleteFile(
          `${process.env.STATIC_PATH}/images/${image}`,
        ),
      );
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
      additionalCharacteristics: {
        value: product.additionalCharacteristics,
        isChanged: false,
      },
      isCharacteristicsChanged: false,
      images,
      deletedImages: [],
      equipments: {
        values: product.equipments,
        isChanged: false,
      },
      examples,
      deletedExamples: [],
      videos: {
        values: product.videos.map((video) => video.rawUrl),
        isChanged: false,
      },
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

  async getProductsForCart(dto: GetCartDto) {
    const products = await this.productsRepository.findAll({
      where: {
        id: dto.ids,
      },
      attributes: ['id', 'name', 'previewImage', 'price'],
    });
    return products;
  }

  async getProductBySlug(slug: string, deep?: boolean) {
    const product = await this.productsRepository.findOne({
      where: { slug },
      rejectOnEmpty: false,
      [deep && 'include']: ['images', 'videos', 'examples', 'category'],
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
