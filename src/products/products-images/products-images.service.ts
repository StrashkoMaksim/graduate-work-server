import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProductImage } from './products-images.model';
import { FilesService } from '../../files/files.service';
import { FileSystemStoredFile } from 'nestjs-form-data';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class ProductsImagesService {
  constructor(
    @InjectModel(ProductImage) private imagesRepository: typeof ProductImage,
    private filesService: FilesService,
    private sequalize: Sequelize,
  ) {}

  async getProducts() {
    return '';
  }

  async createImages(productId: number, imagesArray: FileSystemStoredFile[]) {
    const productImagesResult: ProductImage[] = [];

    for (const image of imagesArray) {
      const preview = await this.filesService.saveImg(image, null, 80);
      const bigImage = await this.filesService.saveImg(image, 1900);
      await this.
    }

    this.sequalize.transaction()
    return '';
  }
}
