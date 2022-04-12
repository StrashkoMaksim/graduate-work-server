import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateProductDto } from './dto/create-product-dto';
import { Product } from './products.model';
import * as slug from 'slug';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product) private productsRepository: typeof Product,
  ) {}

  async getProducts() {
    return await this.productsRepository.findAll();
  }

  async createProducts(dto: CreateProductDto) {
    const category = await this.productsRepository.findByPk(dto.categoryId);

    if (!category) {
      throw new BadRequestException('Выбранной категории не существует');
    }

    const product = await this.productsRepository.create({
      name: dto.name,
      price: dto.price,
      slug: slug(dto.name),
      categoryId: dto.categoryId,
    });
    return product;
  }
}
